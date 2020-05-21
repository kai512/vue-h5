import appAjax from '_libs/app-ajax'

export const getChartsData = () => {

    return new Promise((resolve, reject) => {
        appAjax.postJson({
            service : "/get_charts_data",
            success(data){
    
                resolve(data);
            }
        })

    })
    
}
