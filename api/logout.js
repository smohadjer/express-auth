export default async (req, res) => {
    res.clearCookie('loggedIn');
    res.redirect('/login.html');
}
