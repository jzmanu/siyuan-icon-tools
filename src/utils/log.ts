/// Log
export class Log{
    static debug:boolean = false;
    static i(msg:string){
        console.log(`[INFO] ${msg}`)
    }

    static d(msg:any){
        if(!Log.debug) return;
        console.log(`[DEBUG] ${msg}`)
    }
    
    static e(msg:string){
        console.error(`[ERROR] ${msg}`)
    }

    static w(msg:string){
        console.log(`[WARN] ${msg}`)
    }
}