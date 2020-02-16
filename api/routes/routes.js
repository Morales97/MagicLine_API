const UsersController = require("../controllers/user.controller");
const TramsController = require("../controllers/tram.controller");
const IncidentsController = require("../controllers/incident.controller");
const EventsController = require("../controllers/event.controller");
const VerifyUserMiddleware = require("../auth/middlewares/verify.user.middleware");
const AuthorizationController = require("../auth/controllers/authorization.controller");
const AuthValidationMiddleware = require("../auth/middlewares/auth.validation.middleware");
const AuthPermissionMiddleware = require("../auth/middlewares/auth.permission.middleware");
const config = require("../../common/env.config");

const ADMIN = config.permissionLevels.ADMIN;
const FREE = config.permissionLevels.NORMAL_USER;

module.exports = function(app) {

  // test
  app.get("/test", UsersController.test);


  // ****************************** USER ******************************

  // Crea usuari
  app.post("/users", [UsersController.insert]);

  // Llista tots els usuaris
  app.get("/users", [
    // AuthValidationMiddleware.validJWTNeeded,
    // AuthPermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
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

  // Insert a new tram
  app.post("/trams", [
    AuthValidationMiddleware.validJWTNeeded,
    AuthPermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
    TramsController.insert
  ]);

  // Get all trams
  app.get("/trams", [
    // AuthValidationMiddleware.validJWTNeeded,
    // AuthPermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
    TramsController.getAll
  ]);

  // Get tram by num
  app.get("/trams/:tramNum", [
    AuthValidationMiddleware.validJWTNeeded,
    AuthPermissionMiddleware.onlyOwnerOfTramOrAdmin,
    TramsController.getByNum
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

  // Open tram
  app.post("/openTram/:tramNum", [
    AuthValidationMiddleware.validJWTNeeded,
    AuthPermissionMiddleware.onlyOwnerOfTramOrAdmin,
    TramsController.openTram
  ]);

  // Pas escombra
  app.post("/escombra/:tramNum", [
    AuthValidationMiddleware.validJWTNeeded,
    AuthPermissionMiddleware.onlyOwnerOfTramOrAdmin,
    TramsController.pasEscombra
  ]);

  // Close tram
  app.post("/closeTram/:tramNum", [
    AuthValidationMiddleware.validJWTNeeded,
    AuthPermissionMiddleware.onlyOwnerOfTramOrAdmin,
    TramsController.closeTram
  ]);

   // Avituallament
  app.post("/avituallament", [
    AuthValidationMiddleware.validJWTNeeded,
    AuthPermissionMiddleware.onlyOwnerOfTramOrAdmin,
    TramsController.changeAvitRebut
  ]);

   // Material
  app.post("/material", [
    AuthValidationMiddleware.validJWTNeeded,
    AuthPermissionMiddleware.onlyOwnerOfTramOrAdmin,
    TramsController.changeMaterialRebut
  ]);


// ****************************** INCIDENTS ******************************

  // Crea un incident
  app.post("/incident", [
    AuthValidationMiddleware.validJWTNeeded,
    IncidentsController.create
  ])

  app.get("/incidents", [
    AuthValidationMiddleware.validJWTNeeded,
    AuthPermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
    IncidentsController.getAll
  ])

  app.get("/incidentsTram/:tramNum", [
    AuthValidationMiddleware.validJWTNeeded,
    AuthPermissionMiddleware.onlyOwnerOfTramOrAdmin,
    IncidentsController.getIncidentsTram
  ])

  app.post("/incidentCategory", [
    AuthValidationMiddleware.validJWTNeeded,
    IncidentsController.hasValidCategory,
    IncidentsController.hasValidId,
    IncidentsController.changeCategory
  ])

  app.post("/incidentSolve", [
    AuthValidationMiddleware.validJWTNeeded,
    IncidentsController.hasValidId,
    IncidentsController.solveIncident
  ])

  app.post("/incidentComment", [
    AuthValidationMiddleware.validJWTNeeded,
    IncidentsController.hasValidId,
    IncidentsController.commentIncident
  ])

// ****************************** EVENTS ******************************

  app.get("/events", [
    AuthValidationMiddleware.validJWTNeeded,
    AuthPermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
    EventsController.getAll
  ])

};

