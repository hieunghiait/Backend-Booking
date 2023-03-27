import db from '../models/index';
let getHomePage = async (req, res) => {
    try{
        let data = await db.User.findAll();
        console.log('------------------------')
        console.log(data)
        console.log("------------------------");
        return res.render('homePage.ejs', {
            //truyen bien data ra view 
            data: JSON.stringify(data)
        });
    }catch(e)
    {
        console.log(e)
    }
}
let getAboutPage = (req, res) => {
    return res.render('test/about.ejs')
}
module.exports = {
    getHomePage: getHomePage, 
    getAboutPage: getAboutPage,
}