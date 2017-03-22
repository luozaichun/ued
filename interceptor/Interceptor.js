/**
 * 权限控制
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */

exports.adminRequired = function (req, res, next) {
    if (!req.session.user) {
        return res.render('admin/user',{});
    }
    next()
};