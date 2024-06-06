const catchError = require('../utils/catchError');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const sendEmail = require('../utils/sendEmail');
const EmailCode = require('../models/EmailCode');
const { json } = require('sequelize');
const { use } = require('../routes/user.route');

const getAll = catchError(async(req, res) => {  
    const results = await User.findAll();
    return res.json(results);
});

const create = catchError(async(req, res) => {
    const {email, password, firstName, lastName, image, country, frontBaseUrl} = req.body;
    const encriptedPassword = await bcrypt.hash(password, 10);
    const result = await User.create({
        email,
        password: encriptedPassword,
        firstName,
        lastName,
        image,
        country,
    });
    
    const code = require('crypto').randomBytes(32).toString('hex');
    const link = `${frontBaseUrl}/${code}`;
  
    
    
    await sendEmail({
        to: email, // Email del receptor
		subject: "creando una cuenta", // asunto
		html: `
        <h1>hola ${firstName} ${lastName}</h1>
        <p>gracias por crear una cuenta con nosotros</p>
        <p>para verificar tu email haz click en el sisguiente link:</p>
        <a href="${link}">${link}</a>
        ` // texto
    });
    await EmailCode.create({
        code: code,
        userId: result.id,
    });
    return res.status(201).json(result, sendEmail);
});

const getOne = catchError(async(req, res) => {
    const { id } = req.params;
    const result = await User.findByPk(id);
    if(!result) return res.sendStatus(404);
    return res.json(result);
});

const remove = catchError(async(req, res) => {
    const { id } = req.params;
    await User.destroy({ where: {id} });
    return res.sendStatus(204);
});

const update = catchError(async(req, res) => {
    const { id } = req.params;
    const { email, firstName, lastName, image, country} = req.body;
    const result = await User.update(
        {email, firstName, lastName, image, country},
        { where: {id}, returning: true }
    );
    if(result[0] === 0) return res.sendStatus(404);
    return res.json(result[1][0]);
});

const verifyCode = catchError(async(req, res) => {
    const  { code } = req.params;
    const emailCode = await EmailCode.findOne({where:{code: code}});
    if (!emailCode) return res.status(401),json({message: 'invlalid code'});
  
  const user = await User.findByPk(emailCode.userId);
  user.isVerified = true;
  await use.save(); 

  await emailCode.destroy();
  
  return res.json(emailCode);
});



module.exports = {
    getAll,
    create,
    getOne,
    remove,
    update,
    verifyCode
}