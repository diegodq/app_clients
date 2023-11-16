const express = require('express');
const authController = require('../controllers/authController');
const profileController = require('../controllers/profileController')
const notificationsController = require('../controllers/notificationsController');
const dashboardController = require('../controllers/dashboardController');
const npsController = require('../controllers/npsController');

const router  = express.Router();

/**
 * auth tests
 */
router.get('/', authController.signIn);
router.get('/new-password', authController.newPassword);
router.get('/password-reset', authController.passwordReset);
router.get('/sign-up-company', authController.signUpCompany);
router.get('/sign-up-customer', authController.signUpCustomer);
router.get('/active-customer', authController.activeCustomer);

/**
 * notifications tests
 */
router.get('/invitation', notificationsController.invitation);
router.get('/password-changed', notificationsController.passwordChanged);
router.get('/password-reset', notificationsController.passwordReset);
router.get('/verify-email', notificationsController.verifyEmail);

/**
 * profiles test
 */
router.get('/billing', profileController.billing);
router.get('/choice-product', profileController.choiceProduct);
router.get('/edit-profile-customer', profileController.editProfileCustomer);
router.get('/overview', profileController.overview);
router.get('/settings', profileController.settings);

/**
 * dashboard
 */

router.get('/dashboard', dashboardController.homeDash);

/** ---------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * Pesquisa NPS
 */

router.get('/departments', npsController.departments)
router.get('/topics', npsController.topics)
router.get('/stores', npsController.stores)
router.get('/questions', npsController.personalizedQuestions)
router.get('/tools-survey', npsController.toolsSurvey)
router.get('/manager-survey', npsController.managerSurvey)
router.get('/answers', npsController.answers)



module.exports = router;