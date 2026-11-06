const CONFIG = {
  ORDERS_SHEET: 'Orders',
  FIRST_TICKET_NUMBER: 1001,
  TICKET_PREFIX: 'IC-',
};

const HEADERS = [
  'Ticket ID',
  'Created At',
  'Customer Name',
  'Customer Phone',
  'Address',
  'Order Details',
  'photoFolderUrl',
  'Order Value',
  'Shipping cost',
  'Prepaid',
  'Net charce',
  'Sales Employee',
  'Source',
  'Order Date',
  'Warehouse Status',
  'Prepared By',
  'Warehouse Updated At',
  'Warehouse Notes',
  'Shipping Company',
  'Tracking Number',
  'Shipped By',
  'Shipping Notes',
  'Order Status',
  'Completed By',
  'Completed At',
  'Completion Notes',
];

const PHOTO_ROOT_FOLDER_ID = '1WY_YZkAC7ZWaT5kBu2gs2FWrgsPn3BlZ';


function createOrderPhotoFolder_(ticketId, photoAnswer) {
  const root = DriveApp.getFolderById(
    PHOTO_ROOT_FOLDER_ID
  );

  // Create a folder named after the order ID.
  const orderFolder = root.createFolder(ticketId);

  // Handle either an array of file IDs/URLs
  // or a string containing multiple file references.
  const photos = Array.isArray(photoAnswer)
    ? photoAnswer
    : String(photoAnswer || '')
        .split(/[,\n]+/)
        .map(value => value.trim())
        .filter(Boolean);

  photos.forEach(photo => {
    // Accept a Drive file ID or a Drive URL.
    const match = String(photo).match(
      /[-\w]{25,}/
    );

    if (!match) return;

    try {
      const file = DriveApp.getFileById(match[0]);
      file.moveTo(orderFolder);
    } catch (error) {
      console.error(
        'Could not move photo for ' + ticketId +
        ': ' + error.message
      );
    }
  });

  return orderFolder.getUrl();
}


function onFormSubmit(e) {
  if (!e || !e.namedValues) {
    throw new Error(
      'This function must be run by a spreadsheet form-submit trigger.'
    );
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG.ORDERS_SHEET);

    if (!sheet) {
      throw new Error(`Sheet "${CONFIG.ORDERS_SHEET}" was not found.`);
    }

    validateHeaders(sheet);

    const answers = e.namedValues;
    const action = getAnswer(
      answers,
      'ما العملية التي تريد تنفيذها؟'
    );

    switch (action) {
      case 'تسجيل طلب جديد':
        createOrder(sheet, answers, e);
        break;

      case 'تحديث حالة تجهيز الطلب':
        updateWarehouse(sheet, answers);
        break;

      case 'تسجيل بيانات الشحن':
        updateShipping(sheet, answers);
        break;

      case 'تأكيد اكتمال الطلب':
        completeOrder(sheet, answers);
        break;

      default:
        throw new Error(`Unknown form action: "${action}"`);
    }
  } finally {
    lock.releaseLock();
  }
}

function createOrder(sheet, answers, e) {
  const customer = requiredAnswer(answers, 'اسم العميل');
  const phone = requiredAnswer(answers, 'رقم هاتف العميل');
  const details = requiredAnswer(answers, 'تفاصيل الطلب');
  const address = requiredAnswer(answers, 'العنوان');
  const source = getAnswer(answers, 'المصدر');

  const value = requiredAnswer(
    answers,
    'قيمة الاوردر'
  );


  const shipping = requiredAnswer(
    answers,
    'مصاريف الشحن'
  );

  const prepaid = requiredAnswer(
    answers,
    'دفعه مقدمه'
  );

  const net_charge = parseInt(value) + parseInt(shipping) - parseInt(prepaid);

  const employee = requiredAnswer(
    answers,
    'اسم موظف المبيعات المسؤول'
  );

  const orderDate = requiredAnswer(
    answers,
    'تاريخ تسجيل الطلب'
  );



  const ticketId = generateTicketId(sheet);
  const timestamp = e.namedValues['Timestamp']?.[0]
    ? new Date(e.namedValues['Timestamp'][0])
    : new Date();

  const photoAnswer = getAnswer(
    answers,
    'صور المنتجات'
  );

  const photoFolderUrl = createOrderPhotoFolder_(
    ticketId,
    photoAnswer
  );
  const row = [
    ticketId,
    timestamp,
    customer,
    phone,
    address,
    details,
    photoFolderUrl,
    value,
    shipping,
    prepaid,
    net_charge,
    employee,
    source,
    orderDate,
    'لم يتم التجهيز بعد',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    'جديد',
    '',
    '',
    '',
  ];

  sheet.appendRow(row);

  console.log(`Created order ${ticketId}`);
}

function updateWarehouse(sheet, answers) {
  const ticketId = requiredAnswer(answers, 'رقم التذكرة - المخزن');

  const status = requiredAnswer(
    answers,
    'حالة تجهيز الطلب'
  );

  const employee = requiredAnswer(
    answers,
    'اسم الموظف المسؤول عن التجهيز'
  );

  const notes = getAnswer(answers, 'ملاحظات المخزن');

  const row = findOrderRow(sheet, ticketId);

  if (!row) {
    throw new Error(`Ticket "${ticketId}" was not found.`);
  }

  sheet.getRange(row, 15).setValue(status);
  sheet.getRange(row, 16).setValue(employee);
  sheet.getRange(row, 17).setValue(new Date());
  sheet.getRange(row, 18).setValue(notes);

  if (status === 'تم تجهيز الطلب وأصبح جاهزاً للشحن') {
    sheet.getRange(row, 23).setValue('جاهز للشحن');
  } else {
    sheet.getRange(row, 23).setValue('قيد التجهيز');
  }

  console.log(`Updated warehouse status for ${ticketId}`);
}

function updateShipping(sheet, answers) {
  const ticketId = requiredAnswer(answers, 'رقم التذكرة - الشحن');

  const company = requiredAnswer(answers, 'شركة الشحن');

  const tracking = getAnswer(
    answers,
    'رقم بوليصة الشحن أو التتبع'
  );

  const employee = requiredAnswer(
    answers,
    'اسم الموظف المسؤول عن الشحن'
  );

  const notes = getAnswer(answers, 'ملاحظات الشحن');

  const row = findOrderRow(sheet, ticketId);

  if (!row) {
    throw new Error(`Ticket "${ticketId}" was not found.`);
  }

  const warehouseStatus = sheet.getRange(row, 15).getValue();

  if (warehouseStatus !== 'تم تجهيز الطلب وأصبح جاهزاً للشحن') {
    throw new Error(
      `Ticket "${ticketId}" cannot be shipped before warehouse preparation.`
    );
  }

  sheet.getRange(row, 19).setValue(company);
  sheet.getRange(row, 20).setValue(tracking);
  sheet.getRange(row, 21).setValue(employee);
  sheet.getRange(row, 22).setValue(notes);
  sheet.getRange(row, 23).setValue('تم الشحن');

  console.log(`Updated shipping details for ${ticketId}`);
}

function completeOrder(sheet, answers) {
  const ticketId = requiredAnswer(answers, 'رقم التذكرة - إكمال الطلب');

  const completed = requiredAnswer(
    answers,
    'هل اكتمل الطلب؟'
  );

  const employee = requiredAnswer(
    answers,
    'اسم الموظف الذي أكد اكتمال الطلب'
  );

  const notes = getAnswer(answers, 'ملاحظات إضافية');

  const row = findOrderRow(sheet, ticketId);

  if (!row) {
    throw new Error(`Ticket "${ticketId}" was not found.`);
  }

  if (completed === 'نعم، اكتمل الطلب') {
    const currentStatus = sheet.getRange(row, 23).getValue();

    if (currentStatus !== 'تم الشحن') {
      throw new Error(
        `Ticket "${ticketId}" must be shipped before completion.`
      );
    }

    sheet.getRange(row, 23).setValue('مكتمل');
    sheet.getRange(row, 24).setValue(employee);
    sheet.getRange(row, 25).setValue(new Date());
  }

  sheet.getRange(row, 26).setValue(notes);

  console.log(`Processed completion update for ${ticketId}`);
}

function generateTicketId(sheet) {
  const properties = PropertiesService.getScriptProperties();

  const lastNumber = Number(
    properties.getProperty('LAST_TICKET_NUMBER') ||
    CONFIG.FIRST_TICKET_NUMBER - 1
  );

  const nextNumber = lastNumber + 1;
  const ticketId = `${CONFIG.TICKET_PREFIX}${nextNumber}`;

  properties.setProperty('LAST_TICKET_NUMBER', String(nextNumber));

  return ticketId;
}

function findOrderRow(sheet, ticketId) {
  const lastRow = sheet.getLastRow();

  if (lastRow < 2) {
    return null;
  }

  const ids = sheet.getRange(2, 1, lastRow - 1, 1).getDisplayValues();

  const index = ids.findIndex(
    row => row[0].trim() === ticketId.trim()
  );

  return index === -1 ? null : index + 2;
}

function getAnswer(answers, question) {
  const value = answers[question];

  return value && value.length
    ? String(value[0]).trim()
    : '';
}

function requiredAnswer(answers, question) {
  const value = getAnswer(answers, question);

  if (!value) {
    throw new Error(`Missing required answer: "${question}"`);
  }

  return value;
}

function validateHeaders(sheet) {
  const actual = sheet
    .getRange(1, 1, 1, HEADERS.length)
    .getDisplayValues()[0];

  const valid = HEADERS.every(
    (header, index) => actual[index].trim() === header
  );

  if (!valid) {
    throw new Error(
      'The Orders sheet headers do not match the expected layout.'
    );
  }
}