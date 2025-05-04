const multer = require('multer');
const path = require('path');

// إعداد Multer لتخزين الملفات
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/'); // المجلد الذي سيتم حفظ الصور فيه
    },
    filename: (req, file, cb) => {
        // تحديد اسم الملف
        cb(null, Date.now() + file.originalname.replace(' ','-')); // إضافة التاريخ لضمان أن الاسم فريد
    }
});

// تحديد أنواع الملفات المسموح بها
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // إذا كان الملف من الأنواع المسموح بها
    } else {
        cb(new Error('Only .jpg, .jpeg and .png files are allowed!'), false); // إذا كان الملف غير مسموح به
    }
};

// إعداد multer باستخدام الـ storage و fileFilter
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    // limits: { fileSize: 5 * 1024 * 1024 } // تحديد الحد الأقصى لحجم الصورة (5MB)
});

module.exports = upload;
