/**
 * jquery_select插件
 * 
 * @name jquery_sort插件
 * @package IFLYBookShop
 * @link iflybookshop/js/lib/jquery_sort
 * @author xyyuan
 * @version 1.0
 * @created 20-Aug-2013
 * 
 */

/**
 * 数据源结构类 key：在插件上显示的文字 field：对应的在数据库中的字段名 order：可选asc/desc表示正序和逆序 特殊情况：
 * field置为空字符串"" 则此时order表示完整的value值，
 * 如:'addedTime desc, gradeId asc' 表示按addedTime逆序，按gradeId正序排列
 */
function sortdata(key, field, order) {
	this.key = key;
	this.field = field;
	this.order = order;
}

(function($) {
	$.fn.extend( {

		sort : function(setting) {
			// 提供方法 dropdown("currentValue") 可返回当前选中的currentValue
			if (setting == "currentValue") {
				var _sortId = $(this).selector.substr(1) + "_sort";
				return $('#' + _sortId).attr('currentValue');
			}
			// 将外部获取的setting参数添加到默认设置中
			var sb = $.extend( {
				// 排序数据源
				dataSource : Array(),
				// 默认值
				value : "",
				// 点击选项后的事件
				click : function(value) {
				}
			}, setting);

			// 获取当前容器的名称，作为前缀用来生成各个标签的id，防止重复
			var container = $(this).selector;
			container = container.substr(1);
			// 根据容器名称生成唯一的id span标签需要一个id
			var sortId = container + "_sort";

			var currentValue = sb.value;
			var a_Array = new Array();
			var key;
			var data;
			var value;
			var exist = false;
			// 根据dataSource生成a标签
			for (key in sb.dataSource) {
				data = sb.dataSource[key];
				// 判断field（数据库字段名是否为空） 如果不为空 value需要自己用field和order进行拼接
				if (data.field != "")
					value = data.field + " " + data.order;
				// 如果为空，则value就是order
				else
					value = data.order;
				// 对数据源进行循环遍历，如果找到与设置的value相同的 则将exist置为1 并且将改a标签高亮显示
				if (value == sb.value) {
					a_Array[key] = _createAtag(data, 1);
					exist = true;
				} else
					a_Array[key] = _createAtag(data, 0);
			}
			// 循环结束之后
			if (exist == false) {
				data = sb.dataSource[0];
				a_Array[0] = _createAtag(data, 1);
				if (data.field == "")
					currentValue = data.order;
				else
					currentValue = data.field + " " + data.order;
			}
			// 根据一个data生成一个a标签
			function _createAtag(data, current) {
				var astring = "";
				var currentclass;
				//如果field为空字符串，则不需要箭头
				if (data.field == "") {
					if (current == 1)
						currentclass = "class=\"mr current\"";
					else
						currentclass = "class=\"mr\"";
					astring = "<a	" + currentclass + " clickvalue=\""
							+ data.order + "\" href=\"#\">" + data.key + "</a>";
				} else {
					//如果field为字段名，则需要添加箭头 并根据是否被选中给箭头添加高亮
					if (data.order == "asc") {
						if (current == 1)
							currentclass = "class=\"up current up_current\"";
						else
							currentclass = "class=\"up\"";
						astring = "<a	" + currentclass + " clickvalue=\""
								+ data.field + " " + data.order
								+ "\" href=\"#\">" + data.key + "</a>";
					} else {
						//如果传入的参数为asc则箭头向上，如果不是asc都认为是desc，箭头向下
						if (data.order != "desc")
							data.order = "desc";
						if (current == 1)
							currentclass = "class=\"down current down_current\"";
						else
							currentclass = "class=\"down\"";
						astring = "<a	" + currentclass + " clickvalue=\""
								+ data.field + " " + data.order
								+ "\" href=\"#\">" + data.key + "</a>";
					}
				}
				return astring;
			}
			// 各个a标签之间用|进行连接 作为各个按钮之间的分割线
			var a_tag = a_Array.join('|');

			// 生成排序插件HTML代码 并添加到容器中
			var html_str = "<div class=\"res_sort\"><div class=\"sortbox\">排序方式：<span id=\""
					+ sortId
					+ "\" currentValue=\""
					+ currentValue
					+ "\" class=\"blue\">" + a_tag + "</span></div></div>";
			$(this).empty();
			$(this).append($(html_str));

			// value字符串处理代码 将asc的变成desc desc的变成asc
			function changeorder(str) {
				if(checkorder(str) == "asc")
					value = str.toLowerCase().replace(/asc/,"desc");
				else value = str.toLowerCase().replace(/desc/,"asc");
				return value;
			}
			// value字符串检查代码 判断顺序和逆序并返回
			function checkorder(str) {
				//var str = str.split(" ");
				//return str[1];
				if(str.toLowerCase().indexOf("asc") > 0 )
				    return "asc";
				else return "desc";
			}

			// 添加事件响应
			$('#' + sortId).children('a').click(function() {
				var value = $(this).attr('clickvalue');
				var nextValue;
				var currentValue = $('#' + sortId).attr('currentValue');
				//点击的按钮已经被选中， 需要改变排序的方向， 高亮箭头的方向
				if (value == currentValue) {
					if ($(this).hasClass('mr')) {
						nextValue = value;
					} else if ($(this).hasClass('up')) {
						$(this).removeClass('up');
						$(this).addClass('down');
						$(this).removeClass('up_current');
						$(this).addClass('down_current');
						nextValue = changeorder(value);
						$(this).attr('clickvalue', nextValue);
						$('#' + sortId).attr('currentValue', nextValue);
					} else if ($(this).hasClass('down')) {
						$(this).removeClass('down');
						$(this).addClass('up');
						$(this).removeClass('down_current');
						$(this).addClass('up_current');
						nextValue = changeorder(value);
						$(this).attr('clickvalue', nextValue);
						$('#' + sortId).attr('currentValue', nextValue);
					}
				} else {
					//点击的按钮不是当前选中的按钮， 需要去除原来的高亮 ，给被点击的按钮添加高亮
					$('#' + sortId).attr('currentValue', value);
					$('#' + sortId).children('a').removeClass('current');
					$('#' + sortId).children('a').removeClass('up_current');
					$('#' + sortId).children('a').removeClass('down_current');
					$(this).addClass('current');
					nextValue = value;
					if ($(this).hasClass('mr') == false) {
						var direction = checkorder(nextValue);
						if (direction == "asc")
							$(this).addClass('up_current');
						else if (direction == "desc")
							$(this).addClass('down_current');
					}
				}
				//最后调用用户传入的click函数
				sb.click(nextValue);
			});
		}
	});
})(jQuery);