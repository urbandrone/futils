const {lambda: {curry}, data: {IO, Maybe}} = require('futils');
const {Some, None} = Maybe;

/***************** NOTE *****************
A small example which should give a brief
description of the computer this little
program is executed on. The final result
should either be some string in the form
"Running a _ system with _ architecture"
or "You have an alien computer!"
****************************************/


// proc :: forall a. String -> IO a
const proc = k => IO(() => process[k] || null);

// log :: forall a. a -> IO ()
const log = a => IO(() => { console.log(a); });


// architecture :: forall a. a -> Maybe String
const architecture = a => {
    switch (a) {
        case 'arm':     return Some('ARM 32bit');
        case 'arm64':   return Some('ARM 64bit');
        case 'ia32':
        case 'x32':     return Some('32bit');
        case 'x64':     return Some('64bit');
        case 'ppc':     return Some('PowerPC 32bit');
        case 'ppc64':   return Some('PowerPC 64bit');
        case 'mips':    return Some('MIPS');
        case 'mipsel':  return Some('MIPSel');
        case 's390':    return Some('System/390');
        case 's390x':   return Some('System z');
        default:        return None();
    }
}

// platform :: forall a. a -> Maybe String
const platform = a => {
    switch (a) {
        case 'aix':     return Some('Unix');
        case 'darwin':  return Some('MacOS');
        case 'win32':   return Some('Windows');
        case 'linux':   return Some('Linux');
        case 'freebsd': return Some('FreeBSD');
        case 'sunos':   return Some('SunOS/Solaris');
        case 'openbsd': return Some('OpenBSD');
        default:        return None();
    }
}

// info :: Maybe String -> Maybe String -> Maybe String
const info = curry((os, arch) => {
    return os.flatMap(s => {
        return arch.map(a => {
            return `Running a ${s} system with ${a} architecture`;
        });
    });
});


// getOs :: IO Maybe String
const getOs = proc('platform').map(platform);
// getArch :: IO Maybe String
const getArch = proc('arch').map(architecture);
// alien :: Maybe String
const alien = Some('You have an alien computer!');

// prog :: IO String
const prog = getOs.
    map(info).
    ap(getArch).
    map(a => a.alt(alien).value);


prog.flatMap(log).run();