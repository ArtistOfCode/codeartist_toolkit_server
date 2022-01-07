import * as path from 'path';
import CMD from './cmd_driver';

enum App {
    PDF = 'lib/pdf/pdftk.exe'
}

function execute(app: App, args: string): Promise<string> {
    return CMD.exec(path.join(process.cwd(), app) + (args ? (' ' + args) : ''));
}

class EXE {
    public static pdf(args: string) {
        return execute(App.PDF, args)
    }
}

export default EXE;