import {
    GetFileCallback,
    FileUtils
} from "./storage"

import {
    Item,
    IconType,
    initItems,
    allSettingItems
} from "../base/base"

import { Config} from "../base/config"
import { Log } from "../utils/log"

class ItemManager {
    private itemArrays: { items: Item[], active: boolean }[];
    private data: Item[];
    
    getData(): Item[] {
        return this.data;                                                                                                                                                                  
    }

    constructor(itemArrays: Item[][]) {
        this.itemArrays = itemArrays.map(items => ({ items, active: true }));
        this.mergeActiveArrays();
    }

    initItemArrays(){
        Log.d("initItemArrays");
        settingItems.map((item, index) => {
            Log.d("initItemArrays > value: " + item.value);
            this.itemArrays[index].active = item.value;
        });
        this.mergeActiveArrays();
    }

    changeArrayState(index: number, state: boolean): void {
        if (index >= 0 && index < this.itemArrays.length) {
            this.itemArrays[index].active = state;
        } else {
            throw new Error("Index out of bounds");
        }
    }

    mergeActiveArrays(){
        Log.d("mergeActiveArrays");
        this.data =  this.itemArrays
            .filter(array => array.active)
            .reduce((acc, array) => acc.concat(array.items), []);
    }
}

function getIndex(id: string): number {
    if (id == IconType.People) {
        return 0;
    }else if (id == IconType.Nature) {
        return 1;
    }else if (id == IconType.Food) {
        return 2;
    }else if (id == IconType.Activity) {
        return 3;
    }else if (id == IconType.Travel) {
        return 4;
    }else if (id == IconType.Objects) {
        return 5;
    }else if (id == IconType.Symbols) {
        return 6;
    }else if (id == IconType.Flags) {
        return 7;
    }else{
        return 2;
    }
}

var manager;

export let settingItems: ISettingItem[] = [];

export function initSettingItems() {
    Log.d("initSettingItems");
    manager = new ItemManager(initItems());
    const getFIleCallback:GetFileCallback = {
        onGetFileSuccess(res) {
            if(res != null && res.length > 0){
                Log.d("initSettingItems > res:"+res);
                if(res.indexOf('code') >= 0){
                    settingItems = allSettingItems;
                }else{
                    settingItems = JSON.parse(res);
                }      
            }else{
                Log.d("initSettingItems > res is null");
                settingItems = allSettingItems;
            }
            manager.initItemArrays();
        },
    
        onGetFileFailed(error) {
            Log.e("initSettingItems > error:"+error);
            settingItems = allSettingItems;
            manager.initItemArrays();
        },
    };
    FileUtils.getFile(Config.path,getFIleCallback);
}


export function getUnicode(): string {
    const mergedArray = manager.getData();
    Log.d("getUnicode > length:"+mergedArray.length);
    if (mergedArray.length === 0) {
        // throw new Error("No active items available");
    }
    const randomIndex = Math.floor(Math.random() * mergedArray.length);
    return mergedArray[randomIndex].unicode; 
}

/**
 * 
 * @param key  {
 * @param value 
 * @returns 
 */
export function refreshData(key: string, value: boolean){
    let index = getIndex(key);  
    manager.changeArrayState(index, value);
    manager.mergeActiveArrays();  
    
    settingItems.forEach(item => {
        if (item.key == key) {
            item.value = value;
        }
    });

    let path = Config.path
    let putFileCallback = {
        onPutFileSuccess: function () {
            Log.d("refreshData > put file success");
        },
        onPutFileFailed: function (error) {
            Log.e("refreshData > error:"+error);
        }
    };
    FileUtils.putFile(path,JSON.stringify(settingItems,null,2),putFileCallback)
}





