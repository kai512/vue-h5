/**
 * 设置label文字换行
 * @param params
 * @param num
 * @returns {string}
 */
export const resetLabel = (params, num) => {

    let newParamsName = "";
    let paramsNameNumber = params.length;
    let provideNumber = num || 4;  //一行显示几个字
    let rowNumber = Math.ceil(paramsNameNumber / provideNumber);
    if (paramsNameNumber > provideNumber) {
        for (let p = 0; p < rowNumber; p++) {
            let tempStr = "";
            let start = p * provideNumber;
            let end = start + provideNumber;
            if (p == rowNumber - 1) {
                tempStr = params.substring(start, paramsNameNumber);
            } else {
                tempStr = params.substring(start, end) + "\n";
            }
            newParamsName += tempStr;
        }

    } else {
        newParamsName = params;
    }
    return '{b|' + newParamsName + '}';
}

/**
 * 截取文字设置显示个数（所有文字都进行截取）
 * @param params
 * @param num
 */
export const setEllipsesLabel = (params, num) => {

    let text = params.name + '\n';
    let subLength = num ? num : 4;
    if (text.length <= subLength) {
        return text + `${ Math.round(params.percent) + '%'}`;
    } else if (text.length > subLength) {
        return text = `${text.slice(0, subLength) + '…'}\n${ Math.round(params.percent) + '%'}`
    }
}