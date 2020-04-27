

export default {
	state: {
		historyWord : []
	},
	getters: {

	},
	mutations: {
		setHistoryWord(state, historyWord) {

            if(Array.isArray(historyWord)){

                state.historyWord = historyWord;
                return;
            }

            if(state.historyWord.indexOf(historyWord) > -1) return;

			state.historyWord.unshift(historyWord)
		}

	},
	actions: {

	}
}