// stores/dictionaryStore.js
import { defineStore } from 'pinia';
import { queryDictItem } from '../api/dict';

export const useDictStore = defineStore('dictionary', {
    state: () => ({
        // 存储字典数据的对象，键是字典编码，值是对应的字典数组
        dictionaryCache: {},
    }),

    actions: {
        // 获取字典数据
        async fetchDictionary(dictionaryCode) {
            console.log(dictionaryCode, 'dictionaryCode');

            // 如果字典数据已缓存，直接返回
            if (this.dictionaryCache[dictionaryCode]) {
                console.log(this.dictionaryCache[dictionaryCode], '返回缓存的数据');
                return this.dictionaryCache[dictionaryCode];
            }

            try {
                // 如果字典数据不存在，则发起请求                
                const response = await queryDictItem({ dictionaryCode: dictionaryCode });
                this.dictionaryCache[dictionaryCode] = response.data; // 缓存数据
                console.log(response.data, '返回请求的数据');
                return response.data;
            } catch (error) {
                console.error('字典数据加载失败', error);
                throw new Error('字典数据加载失败');
            }
        },

        // 获取特定字典编码的字典数据
        getDictionary(dictionaryCode) {
            if (this.dictionaryCache[dictionaryCode]) {
                return this.dictionaryCache[dictionaryCode] || [];
            }else{
                return this.fetchDictionary(dictionaryCode);
            }
        },
    },
});
