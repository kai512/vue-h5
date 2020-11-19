/**
 * 高德地图工具类
 * @author hlijing
 * @since 2018-7-6
 */

// 地图对象
var map = new AMap.Map('notReality', {})

// 定位对象
var geolocation

/**
 * 开放方法
 */
var exportMethods = {

	/**
	 * 根据当前位置获取位置信息（中文）
	 * @param {Object} isHighAcc 是否高精度
	 * @param {Object} callback 回调函数
	 * @param {Object} callbackError 回调函数
	 */
	getCurrentPositionCn: function(isHighAcc, callback, callbackError) {
		isHighAcc == null ? isHighAcc = true : isHighAcc = isHighAcc

		// 定位插件(如果是插件就要用map.plugin的方式插入)
		map.plugin('AMap.Geolocation', function() {
			geolocation = new AMap.Geolocation({
				enableHighAccuracy: isHighAcc, // 是否使用高精度定位，默认:true
				timeout: 10000 // 超过10秒后停止定位，默认：无穷大
			})
			geolocation.getCurrentPosition(function(status, result) {
				if(status == 'error') {
					switch(result.info) {
						case 'FAILED':
							callbackError && callbackError('获取当前位置失败，请检查你的定位权限')
							break
						case 'NOT_SUPPORTED':
							callbackError && callbackError('当前浏览器不支持定位功能')
							break
						default:
							break
					}
				}
				callback && callback(result.formattedAddress)
			})
		})
	},

	/**
	 * 根据当前地址获取位置信息（经纬度）
	 * @param {Object} callback 回调函数
	 * @param {Object} callbackError 回调函数
	 */

	/**
	 * obj.getCurrentPosition(function(result){})
	 * result格式
	 * {
	 * 	lng ：lng,
	 * 	lat : lat
	 * }
	 */
	getCurrentPosition: function(callback, callbackError) {
		exportMethods.getCurrentPositionCn(true, function(result) {
			if(!result) {
				callbackError && callbackError()
				return
			}

			var addressCn = result
			// 地理编码插件
			map.plugin('AMap.Geocoder', function() {
				var geocoder = new AMap.Geocoder()
				geocoder.getLocation(addressCn, function(status, result) {
					var geoCodes = result.geocodes

					var address = {
						lng: geoCodes[0].location.lng,
						lat: geoCodes[0].location.lat
					}
					if(status == 'error') {
						switch(result.info) {
							case 'FAILED':
								callbackError && callbackError('获取当前位置失败，请检查你的定位权限')
								break
							case 'NOT_SUPPORTED':
								callbackError && callbackError('当前浏览器不支持定位功能')
								break
							default:
								break
						}
					}
					callback && callback(address)
				})
			})
		}, function(msg) {
			callbackError && callbackError(msg)
		})
	},

	/**
	 * 获取当前位置（存在包括中文所有信息）
	 * @param {Object} isHighAcc 是否高精度
	 * @param {Object} callback 回调
	 */
	getCurrentPositionPart: function(isHighAcc, callback) {
		isHighAcc == null ? isHighAcc = true : isHighAcc = isHighAcc

		// 定位插件(如果是插件就要用map.plugin的方式插入)
		map.plugin('AMap.Geolocation', function() {
			geolocation = new AMap.Geolocation({
				enableHighAccuracy: isHighAcc, // 是否使用高精度定位，默认:true
				timeout: 10000 // 超过10秒后停止定位，默认：无穷大
			})
			geolocation.getCurrentPosition(function(status, result) {
				callback && callback(result.addressComponent)
			})
		})
	},

	/**
	 * 根据经纬度反向编译地址（所有）
	 * @param {Object} obj 经纬度
	 * @param {Object} callback 回调
	 */
	getCurrentPositionAllByLanLat: function(obj, callback) {
		map.plugin('AMap.Geocoder', function() {
			var geocoder = new AMap.Geocoder()
			geocoder.getAddress(obj, function(code, result) {
				if(result.info === 'OK') {
					callback && callback(result.regeocode.addressComponent, result.regeocode.formattedAddress)
				} else {
					// 获取地址失败
				}
			})
		})
	},

	/**
	 * 联想输入
	 * @param {Object} city 城市
	 * @param {Object} keyword 关键词
	 * @param {Object} callback 回调
	 * @param {object} callbackError 错误回调
	 * @param {Boolean} citylimit 限定城市
	 */
	autoComlete: function(city, keyword, callback, callbackError, citylimit) {
		AMap.plugin('AMap.Autocomplete', function() {
			// 实例化Autocomplete
			var autoOptions = {
				city: city,
				citylimit: citylimit || false // 默认值为：false, true：强制限制设定城市，false：不强制限制设定城市
			}
			var autocomplete = new AMap.Autocomplete(autoOptions)
			autocomplete.search(keyword, function(status, result) {
				console.log(result)
				if(status == 'complete') {
					if(result && result.tips) {
						callback && callback(result.tips)
					} else {
						callback && callback([])
					}
				} else {
					callback && callback([])
				}
			})
		})
	},

	/**
	 * 附近地点搜索
	 * @param {String} keyword 关键字
	 * @param {Number} page 当前页
	 * @param {Number} pageSize 每页条数
	 * @param {Array} centerPoint 经纬度
	 * @param {String} citycode 城市名
	 * @param {Object} callback 回调
	 * @param {object} callbackError 错误回调
	 */
	placeSearch(keyword, page, pageSize, centerPoint, citycode, callback, callbackError) {
		AMap.service(['AMap.PlaceSearch'], function() {
			var placesearch = new AMap.PlaceSearch({
				pageSize: pageSize || 10, // 每页条数
				pageIndex: page || 1, // 获取某页
				city: citycode, // 指定城市名(如果你获取不到城市名称，这个参数也可以不传，注释掉)
				extensions: 'all' // 设定为'all'返回周边POI、道路交叉口等信息，默认为'base',
			})

			// 第一个参数是关键字
			// 第二个参数是经纬度，数组类型
			// 第三个参数是半径，周边的范围
			// 第四个参数为回调函数
			placesearch.searchNearBy(keyword, centerPoint, 5000, function(status, result) {
				console.log(status)
				if(status == 'complete') {
					if(result && result.poiList) {
						callback && callback(result.poiList.pois)
					} else {
						callback && callback([])
					}
				} else if(status == 'no_data') {
					callbackError && callbackError('没有更多数据了')
				} else {
					callbackError && callbackError('获取当前位置失败，请检查你的定位权限')
				}
			})
		})
	},

	/**
	 * 获取定位的所有信息（包括省、市、县）
	 * @param {Object} isHighAcc 是否高精度
	 * @param {Object} callback 回调
	 * @param {Object} callbackError 回调函数
	 */
	getCurrentPositionAll: function(isHighAcc, callback, callbackError) {
		isHighAcc == null ? isHighAcc = true : isHighAcc = isHighAcc

		// 定位插件(如果是插件就要用map.plugin的方式插入)
		map.plugin('AMap.Geolocation', function() {
			geolocation = new AMap.Geolocation({
				enableHighAccuracy: isHighAcc, // 是否使用高精度定位，默认:true
				timeout: 10000, // 超过10秒后停止定位，默认：无穷大
				extensions: 'all' // 设定为'all'返回周边POI、道路交叉口等信息，默认为'base',
			})
			geolocation.getCurrentPosition(function(status, result) {
				if(status == 'error') {
					switch(result.info) {
						case 'FAILED':
							callbackError && callbackError('获取当前位置失败，请检查你的定位权限')
							break
						case 'NOT_SUPPORTED':
							callbackError && callbackError('当前浏览器不支持定位功能')
							break
						default:
							break
					}
				}
				callback && callback(result)
			})
		})
	},

	/**
	 * 百度经纬度转高德经纬度
	 * @param {Object} point 传入百度经纬度
	 * @param {Object} callback 回调
	 */
	BDPositionToGDPosition: function(point, callback) {
		var x = point.lng - 0.0065
		var y = point.lat - 0.006
		var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * Math.PI)
		var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * Math.PI)
		point.lng = z * Math.cos(theta)
		point.lat = z * Math.sin(theta)
		callback && callback(point)
	},

	/**
	 * 高德经纬度转百度经纬度
	 * @param {Object} point 传入百度经纬度
	 * @param {Object} callback 回调
	 */
	GDPositionToBDPosition: function(point, callback) {
		var x = point.lng
		var y = point.lat
		var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * Math.PI)
		var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * Math.PI)
		point.lng = z * Math.cos(theta) + 0.0065
		point.lat = z * Math.sin(theta) + 0.006
		callback && callback(point)
	},

	convertFromBD: function(lists, callback) {
		if(lists.length <= 40) {
			listResult = []
			AMap.convertFrom(lists, 'baidu',
				function(status, ret) {
					if(ret && ret.locations && ret.locations.length) {
						for(var i = 0; i < ret.locations.length; i++) {
							var lng = ret.locations[i].lng
							var lat = ret.locations[i].lat
							listResult.push({
								lng: lng,
								lat: lat
							})
						}
						callback && callback(listResult)
					}
				})
		}
		if(lists.length > 40) {
			var len = lists.length / 40
			listResult = []

			var lendist = 0

			for(var i = 0; i < len; i++) {
				var lstart = i * 40
				var lend = i == len - 1 ? len - 1 : (i + 1) * 40

				AMap.convertFrom(lists.slice(lstart, lend), 'baidu',
					function(status, ret) {
						if(ret && ret.locations && ret.locations.length) {
							for(var i = 0; i < ret.locations.length; i++) {
								var lng = ret.locations[i].lng
								var lat = ret.locations[i].lat
								listResult.push({
									lng: lng,
									lat: lat
								})
								lendist++
							}
							if(lendist == len) {
								callback && callback(listResult)
							}
						}
					})
			}
		}
	},

	/**
	 * 改变地图模式
	 * @param {Object} map 地图对象
	 * @param {Object} mapType 地图类型（0：二维；1：卫星图）
	 */
	changeMapType: function(map, mapType) {
		if(map && mapType) {
			var layers = map.getLayers()

			// 常规地图
			if(mapType == '0') {
				for(var i in layers) {
					if(layers[i].CLASS_NAME == 'AMap.TileLayer.Satellite') {
						// 存在卫星图即删除
						layers.splice(i, 1)
						continue
					}
					i++
				}
				map.setLayers(layers)
				return
			}
			// 卫星图
			var hasSatellite = false

			for(var i in layers) {
				layers[i].CLASS_NAME == 'AMap.TileLayer.Satellite' ? hasSatellite = true : hasSatellite
			}
			hasSatellite ? layers : layers.push(new AMap.TileLayer.Satellite())
			map.setLayers(layers)
		}
	},

	getOfflinePosition: function(callback, callbackError) {
		// 根据ip获取离线位置
		map.plugin(['AMap.CitySearch'], function() {
			// 实例化城市查询类
			var citysearch = new AMap.CitySearch()

			// 自动获取用户IP，返回当前城市
			citysearch.getLocalCity()
			AMap.event.addListener(citysearch, 'complete', function(result) {
				if(result && result.city && result.bounds) {
					var lng = (result.bounds.northeast.lng + result.bounds.southwest.lng) / 2
					var lat = (result.bounds.northeast.lat + result.bounds.southwest.lat) / 2
					result.position = {
						lng: lng,
						lat: lat,
						M: lng,
						O: lat
					}
					callbackError && callbackError('无法获取定位权限，定位到当前城市')
					callback && callback(result)
				}
			})
			AMap.event.addListener(citysearch, 'error', function(result) {
				callbackError && callbackError(result.info)
			})
		})
	},

	/**
	 * 地图选点
	 * @param {Object} map 地图对象
	 * @param {Object} callback 回调
	 */
	getCurrentPositionByClickOnMap: function(map, callback) {
		// 要返回的实际地址
		var address = ''

		// 要返回的兴趣点地址
		var poiName = ''

		// 缓存搜索地址
		var searchAddress = []

		// 初始化地址
		var position = null

		var mapPosition = map.getCenter()
		var mapZoom = map.getZoom()

		// 缩放工具
		map.plugin(['AMap.ToolBar'], function() {
			// 加载工具条
			var tool = new AMap.ToolBar({
				direction: false
			})
			map.addControl(tool)
		})

		var auto = new AMap.Autocomplete()
		var placeSearch = new AMap.PlaceSearch({
			map: map
		})

		//			// 联想输入
		//			$("#tipinput").on("input propertychange", function() {
		//				var $that = $(this);
		//				var keyword = $that.attr("value");
		//				$("#suggestWrapper").addClass("hide"); // 隐藏自动填充
		//				if(keyword != "") {
		//					$("#suggestWrapper").removeClass("hide");
		//				}
		//
		//				auto.search(keyword, function(status, result) {
		//					if(result.info == "OK") {
		//
		//						// 过滤条件
		//						var searchTips = [];
		//						var j = 0;
		//						for(var i = 0; i < result.tips.length; i++) {
		//							if(result.tips[i].location && result.tips[i].location.M && result.tips[i].location.O) {
		//								searchTips[j++] = result.tips[i];
		//							}
		//						}
		//
		//						$("#suggestWrapper").html(artTemplate("suggestTemp", {
		//							datalist: searchTips
		//						}));
		//					}
		//				});
		//			});

		// 选择地图点位
		map.on('click', function(e) {
			address = ''

			// 地图点击后选点
			map.clearMap()
			var marker = new AMap.Marker({
				map: map,
				position: [e.lnglat.M, e.lnglat.O]
			})
		})

		// 建议选择框列表点击事件
		//			$("#suggestWrapper").on("click", "li", function() {
		//				var $that = $(this);
		//				if(!$that.attr("lng") || !$that.attr("lat")) {
		//					top.layer.msg("请选择一个具体的地址");
		//					return;
		//				}
		//				map.clearMap();
		//				var marker = new AMap.Marker({
		//					map: map,
		//					position: [$that.attr("lng"), $that.attr("lat")]
		//				});
		//
		//				address = $that.find("span").text().trim();
		//				poiName = $that.attr("name");
		//
		//				// 自动锁定图标
		//				map.setFitView();
		//				var name = $that.attr("name");
		//				$("#tipinput").attr("value", name);
		//				$("#suggestWrapper").addClass("hide");
		//			});

		// 确认地图选点
		//			$(".js-tag-map-confirm").on("click", function() {
		//
		//				var markers = map.getAllOverlays("marker");
		//
		//				if(markers.length > 1) {
		//					for(var i = 0; i < markers.length; i++) {
		//						var $currentMarker = $(markers[i].Qi.contentDom);
		//						if($currentMarker.hasClass("selected")) {
		//							position = markers[i].Qi.position;
		//							address = searchAddress[i];
		//						}
		//					}
		//				} else if(markers.length == 1) {
		//					position = markers[0].Qi.position;
		//				}
		//
		//				if(!position) {
		//					top.layer.msg("请至少选择唯一的一个点位");
		//				}
		//
		//				// 获取地址坐标
		//
		//				var lnglat = {
		//					lng: position.M,
		//					lat: position.O
		//				}
		//
		//				// 高德地址转化为百度地址，并回填
		//				exportMethods.GDPositionToBDPosition(lnglat, function(ret) {
		//					if(ret) {
		//						$("#tipinput").attr("value", "");
		//						$("#mapContent").addClass("hide");
		//
		//						var lng = (ret.lng).toFixed(6);
		//						var lat = (ret.lat).toFixed(6);
		//
		//						if(!address) {
		//							exportMethods.getCurrentPositionAllByLanLat([position.lng, position.lat], function(ret, selecter) {
		//								address = selecter.replace(ret.province, "").replace(ret.city, "").replace(ret.district, "");
		//
		//								// 标志性建筑为空时取实际地址去掉街道名
		//								poiName = ret.building || selecter.replace(ret.province, "").replace(ret.city, "").replace(ret.district, "").replace(ret.township, "");
		//								callback && callback({
		//									lng: lng,
		//									gdLng: position.lng,
		//									lat: lat,
		//									gdLat: position.lat,
		//									address: address,
		//									poiName: poiName
		//								});
		//							});
		//						} else {
		//							callback && callback({
		//								lng: lng,
		//								gdLng: position.lng,
		//								lat: lat,
		//								gdLat: position.lat,
		//								address: address,
		//								poiName: poiName
		//							});
		//						}
		//					}
		//				});
		//			});

		// 取消地图选点
		//			$(".js-tag-map-close").on("click", function() {
		//				address = "";
		//				map.clearMap();
		//				map.setZoomAndCenter(mapZoom, mapPosition);
		//				$("#tipinput").attr("value", "");
		//				$("#mapContent").addClass("hide");
		//				callback && callback(null);
		//			});
	}
}

export default exportMethods