const UsersController = require("../controllers/user.controller");
const TramsController = require("../controllers/tram.controller");
const VerifyUserMiddleware = require("../auth/middlewares/verify.user.middleware");
const AuthorizationController = require("../auth/controllers/authorization.controller");
const AuthValidationMiddleware = require("../auth/middlewares/auth.validation.middleware");
const AuthPermissionMiddleware = require("../auth/middlewares/auth.permission.middleware");
const config = require("../../common/env.config");

const ADMIN = config.permissionLevels.ADMIN;
const FREE = config.permissionLevels.NORMAL_USER;

module.exports = function(app) {
  // ****************************** USER ******************************

  // Crea usuari
  app.post("/users", [UsersController.insert]);

  // Llista tots els usuaris
  app.get("/users", [
    AuthValidationMiddleware.validJWTNeeded,
    AuthPermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
    UsersController.getAll
  ]);

  // Busca usuari per ID
  app.get("/users/:userId", [
    AuthValidationMiddleware.validJWTNeeded,
    AuthPermissionMiddleware.minimumPermissionLevelRequired(FREE),
    AuthPermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
    UsersController.getById
  ]);

  // Actualitza usuari
  app.patch("/users/:userId", [
    AuthValidationMiddleware.validJWTNeeded,
    AuthPermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
    AuthPermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
    UsersController.patchUser
  ]);

  // Actualitza el permís d'un usuari
  app.patch("/usersPermission/:userId", [
    AuthValidationMiddleware.validJWTNeeded,
    AuthPermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
    UsersController.patchUserPermission
  ]);

  // Esborra usuari
  app.delete("/users/:userId", [
    AuthValidationMiddleware.validJWTNeeded,
    AuthPermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
    UsersController.deleteById
  ]);

  // Login usuari - retorna authToken i refreshToken
  app.post("/auth", [
    VerifyUserMiddleware.hasAuthValidFields,
    VerifyUserMiddleware.isPasswordAndUserMatch,
    AuthorizationController.login
  ]);

  /*
    app.post('/auth/refresh', [
        AuthValidationMiddleware.validJWTNeeded,
        AuthValidationMiddleware.verifyRefreshBodyField,
        AuthValidationMiddleware.validRefreshNeeded,
        AuthorizationController.login
    ]);*/

  // ****************************** TRAM ******************************

  // Insert a new tram - Caution! do not repeat num_id
  app.post("/trams", [
    AuthValidationMiddleware.validJWTNeeded,
    AuthPermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
    TramsController.insert
  ]);

  // Get all trams
  app.get("/trams", [
    AuthValidationMiddleware.validJWTNeeded,
    AuthPermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
    TramsController.getAll
  ]);

  // Get tram by num_id
  app.get("/trams/:tramNumId", [
    AuthValidationMiddleware.validJWTNeeded,
    AuthPermissionMiddleware.onlyOwnerOfTramOrAdmin,
    TramsController.getByNumId
  ]);

  // Get tram by _id
  app.get("/trams_id/:tramId", [
    AuthValidationMiddleware.validJWTNeeded,
    AuthPermissionMiddleware.onlyOwnerOfTramOrAdmin,
    TramsController.getBy_Id
  ]);
  
  // Get own tram
  app.get("/ownTram", [
    AuthValidationMiddleware.validJWTNeeded,
    VerifyUserMiddleware.hasValidTramId,
    TramsController.getOwnTram
  ]);

  // Esborra tram
  app.delete("/trams/:tramId", [
    AuthValidationMiddleware.validJWTNeeded,
    AuthPermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
    TramsController.deleteBy_Id
  ]);

  // Patch tram with custom state
  app.patch("/trams/:tramNumId", [
    AuthValidationMiddleware.validJWTNeeded,
    AuthPermissionMiddleware.onlyOwnerOfTramOrAdmin,
    TramsController.patchTramState
  ]);

  // Open tram
  app.post("/openTram/:tramNumId", [
    AuthValidationMiddleware.validJWTNeeded,
    AuthPermissionMiddleware.onlyOwnerOfTramOrAdmin,
    TramsController.openTram
  ]);

  // Close tram
  app.post("/closeTram/:tramNumId", [
    AuthValidationMiddleware.validJWTNeeded,
    AuthPermissionMiddleware.onlyOwnerOfTramOrAdmin,
    TramsController.closeTram
  ]);


};
