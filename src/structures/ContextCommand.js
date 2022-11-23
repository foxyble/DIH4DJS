'use strict';

const BaseApplicationCommand = require("./BaseApplicationCommand");

class ContextCommand extends BaseApplicationCommand { }

module.exports = ContextCommand;

(function (ContextCommand) {
    class Message extends ContextCommand { };
    ContextCommand.Message = Message;
    class User extends ContextCommand { };
    ContextCommand.User = User;
})(ContextCommand = module.exports || (module.exports = {}));