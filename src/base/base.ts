export interface Item {
    unicode: string;
    description: string;
    description_zh_cn: string;
    keywords: string[];
}

export class IconType {
   static readonly People = "people";
   static readonly Nature = "nature";
   static readonly Food = "food";
   static readonly Activity = "activity";
   static readonly Travel = "travel";
   static readonly Objects = "objects";
   static readonly Symbols = "symbols";
   static readonly Flags = "flags"
}

// export const itemArrays: Item[][] = [
//     window.siyuan.emojis.filter(item => {
//         return item.id == IconType.People;
//     })[0].items,
//     window.siyuan.emojis.filter(item => {
//         return item.id == IconType.Nature;
//     })[0].items,
//     window.siyuan.emojis.filter(item => {
//         return item.id == IconType.Food;
//     })[0].items,
//     window.siyuan.emojis.filter(item => {
//         return item.id == IconType.Activity;
//     })[0].items,
//     window.siyuan.emojis.filter(item => {
//         return item.id == IconType.Travel;
//     })[0].items,
//     window.siyuan.emojis.filter(item => {
//         return item.id == IconType.Objects;
//     })[0].items,
//     window.siyuan.emojis.filter(item => {
//         return item.id == IconType.Symbols;
//     })[0].items,
//     window.siyuan.emojis.filter(item => {
//         return item.id == IconType.Flags;
//     })[0].items
// ];

export function initItems():Item[][]{
	const itemArrays: Item[][] = [
		window.siyuan.emojis.filter(item => {
			return item.id == IconType.People;
		})[0].items,
		window.siyuan.emojis.filter(item => {
			return item.id == IconType.Nature;
		})[0].items,
		window.siyuan.emojis.filter(item => {
			return item.id == IconType.Food;
		})[0].items,
		window.siyuan.emojis.filter(item => {
			return item.id == IconType.Activity;
		})[0].items,
		window.siyuan.emojis.filter(item => {
			return item.id == IconType.Travel;
		})[0].items,
		window.siyuan.emojis.filter(item => {
			return item.id == IconType.Objects;
		})[0].items,
		window.siyuan.emojis.filter(item => {
			return item.id == IconType.Symbols;
		})[0].items,
		window.siyuan.emojis.filter(item => {
			return item.id == IconType.Flags;
		})[0].items
	];
	return itemArrays;
}

export let allSettingItems: ISettingItem[] = [
    {
        type: 'checkbox',
        title: '表情和人物',  
        description: '',
        key: 'people',
        value: true,
    },
    {
        type: 'checkbox',
        title: '动物和自然',  
        description: '',
        key: 'nature',
        value: true,
    },
    {
        type: 'checkbox',
        title: '食物和饮料',  
        description: '',
        key: 'food',
        value: true,
    },
    {
        type: 'checkbox',
        title: '活动',  
        description: '',
        key: 'activity',
        value: true,
    },
    {
        type: 'checkbox',
        title: '旅行和地点',  
        description: '',
        key: 'travel',
        value: true,
    },
    {
        type: 'checkbox',
        title: '物件',  
        description: '',
        key: 'objects',
        value: true,
    },
    {
        type: 'checkbox',
        title: '符号',  
        description: '',
        key: 'symbols',
        value: true,
    },
    {
        type: 'checkbox',
        title: '旗帜',  
        description: '',
        key: 'flags',
        value: true,
    }
];