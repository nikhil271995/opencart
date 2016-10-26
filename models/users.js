var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var userSchema = new Schema({
	first_name:{
		type: String,
	},
	last_name:{
		type: String,
	},
	name :{
		type:String,
	},
	email:{
		type: String,
		unique: true
	},
	altEmail:{
		type: String,
		unique : false,
	},
	description: {
		type:String,
		unique:false,
		default:""
	},
	lastLogin: {
		type: String,
		unique : false,
		default : "Never"
	},
	password:{
		type: String,
	},
	phone:{
		mobile:Number,
		isd:Number,
		std:Number,
		landline:Number
	},
	google : {
		id : String,
		token : String,
		name : String,
		email : String,
		refreshToken : String,
		image : String
	}
});

module.exports = mongoose.model('users', userSchema);

