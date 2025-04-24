/*
• @Eliasivan 
- https://github.com/Eliasivan 
*/
function _0x3657(_0x527110, _0x29d61f) {
    const _0x396558 = _0x1221();
    return _0x3657 = function (_0x176cb7, _0x304b4b) {
        _0x176cb7 = _0x176cb7 - (-0x36f + 0x4 * 0x875 + -0x7 * 0x419);
        let _0x31d100 = _0x396558[_0x176cb7];
        return _0x31d100;
    }, _0x3657(_0x527110, _0x29d61f);
}
function _0x1221() {
    const _0x63973d = [
        'reply',
        '373662aMwPyH',
        '1994244rDUbLF',
        '458328BsZLFW',
        '134745EfQtiu',
        'mimetype',
        'command',
        '34738dTRRna',
        'error',
        'setprofile',
        '8uVzlbD',
        'tools',
        'user',
        'jid',
        '✘\x20Hubo\x20un\x20error\x20al\x20intentar\x20cambiar\x20la\x20foto\x20de\x20perfil.',
        '1952634WvdElE',
        'test',
        'rGoJp',
        '594288LQFcOX',
        '8TdzEOM',
        'quoted',
        '🍬\x20Por\x20favor,\x20responde\x20a\x20una\x20imagen\x20con\x20el\x20comando\x20*setprofile*\x20para\x20actualizar\x20la\x20foto\x20de\x20perfil\x20de\x20WhatsApp.',
        'tags',
        'help',
        '🍬\x20Foto\x20de\x20perfil\x20actualizada.'
    ];
    _0x1221 = function () {
        return _0x63973d;
    };
    return _0x1221();
}
const _0x1dc932 = _0x3657;
(function (_0x38ee0b, _0x514766) {
    const _0x3aa07c = _0x3657, _0x56ee11 = _0x38ee0b();
    while (!![]) {
        try {
            const _0xe33823 = -parseInt(_0x3aa07c(0x1c4)) / (0x200 * -0x4 + 0x150b + -0xd0a) * (-parseInt(_0x3aa07c(0x1c1)) / (0x797 * 0x2 + -0x14 * 0x9f + -0x2c0)) + parseInt(_0x3aa07c(0x1bd)) / (0x76d + 0x23e5 + -0x2b4f) + -parseInt(_0x3aa07c(0x1cc)) / (0x37 * -0x95 + 0x398 + 0x1 * 0x1c6f) + parseInt(_0x3aa07c(0x1be)) / (0x41b + -0x136f + 0xf59) + parseInt(_0x3aa07c(0x1c9)) / (0xb7b * -0x2 + 0x1b04 + -0x408) + -parseInt(_0x3aa07c(0x1bc)) / (0x1566 + 0x1066 + 0x125 * -0x21) * (parseInt(_0x3aa07c(0x1cd)) / (0x2059 + -0x175f + -0x8f2)) + -parseInt(_0x3aa07c(0x1bb)) / (0xfa6 + 0xa0 * 0x39 + 0x3f1 * -0xd);
            if (_0xe33823 === _0x514766)
                break;
            else
                _0x56ee11['push'](_0x56ee11['shift']());
        } catch (_0x212d25) {
            _0x56ee11['push'](_0x56ee11['shift']());
        }
    }
}(_0x1221, 0x18 * -0x32e5 + 0x5a7b + 0x6ffab));
let handler = async (_0x5753c3, {conn: _0x2c56d3}) => {
    const _0x49ced6 = _0x3657, _0x908a0d = {
            'rGoJp': _0x49ced6(0x1b6),
            'QIIWE': _0x49ced6(0x1b9)
        };
    if (!_0x5753c3['quoted'] || !/image/[_0x49ced6(0x1ca)](_0x5753c3[_0x49ced6(0x1ce)][_0x49ced6(0x1bf)]))
        return _0x5753c3[_0x49ced6(0x1ba)](_0x908a0d[_0x49ced6(0x1cb)]);
    try {
        const _0x3a4591 = await _0x5753c3[_0x49ced6(0x1ce)]['download']();
        await _0x2c56d3['updateProfilePicture'](_0x2c56d3[_0x49ced6(0x1c6)][_0x49ced6(0x1c7)], _0x3a4591), await _0x5753c3['reply'](_0x908a0d['QIIWE']);
    } catch (_0x1ac4db) {
        console[_0x49ced6(0x1c2)](_0x1ac4db), _0x5753c3[_0x49ced6(0x1ba)](_0x49ced6(0x1c8));
    }
};
handler[_0x1dc932(0x1b8)] = [_0x1dc932(0x1c3)], handler[_0x1dc932(0x1b7)] = [_0x1dc932(0x1c5)], handler[_0x1dc932(0x1c0)] = [_0x1dc932(0x1c3)];
export default handler;