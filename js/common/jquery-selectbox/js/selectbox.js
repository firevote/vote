/**
 * jquery_select插件
 * 
 * @name jquery_select插件
 * @package IFLYBookShop
 * @link
 * @author xyyuan
 * @version 1.0
 * @created 15-Aug-2013
 * 
 */
(function($) {
	$.fn.extend( {

		dropdown : function(setting) {
			// 提供方法 dropdown("currentValue") 可返回当前选中的currentValue
		if (setting == "currentValue"){
			var _selectId = $(this).selector.substr(1) + "select";
			return $('#' + _selectId).attr('currentValue');
		}

		// 将外部获取的setting参数添加到默认设置中
		var sb = $.extend( {
			// 下拉框方向
			direction : 'down',
			// 组件宽
			width : 120,
			// 下拉框高度
			height : 150,
			// 组件之间的间距（右边距）
			space : 25,
			// 缺省显示选项
			value : '',
			// 下拉表项数组
			dataSource : {},
			// 组件样式
			style : '',
			// 点击选项后的事件
			change : function(key, value) {
			}
		}, setting);

		// 获取当前容器的名称，作为前缀用来生成各个标签的id，防止重复
		var container = $(this).selector;
		container = container.substr(1);
		
		var currentValue;
		var defaultKey;
		var optionTemplate = "";
		var value;
		var key;
		var exist = false;
		
		//检测数组中是否存在value 若不存在默认第一个为value
		for (key in sb.dataSource) {
			value = sb.dataSource[key];
			if(value == sb.value){
				exist = true;
			}
		}
		
		// 根据输入的数据源数组转换成li标签
		for (key in sb.dataSource) {
		//检测数组中是否存在value 若不存在默认第一个为value
			if(exist == false){		
				sb.value = sb.dataSource[key];
				exist = true;
			}
			value = sb.dataSource[key];
			if (value == sb.value) {
				currentValue = value;
				defaultKey = key;
				optionTemplate += "<li options_value=\"" + value
						+ "\" class=\"current\">" + key + "</li>";
			} else {
				optionTemplate += "<li options_value=\"" + value + "\">" + key
						+ "</li>";
			}
		}
		
		// 生成各组件的Id
		var selectId = container + "select";
		var arrowId = container + "arrow";
		var dropdownId = container + "dropdown";
		var listId = container + "list";

		// 计算组件的长宽
		var listWidth = sb.width;
		var listHeight = sb.height;
		var buttonWidth = listWidth - 10;
		var totalWidth = listWidth + sb.space;

		// 根据组件的方向对列表框进行定位
		var listDirection;
		if (sb.direction == 'up')
			listDirection = "bottom:28px;";
		else
			listDirection = "top:28px;";

		// 根据style确定需要使用的css
		var style;
		if ((sb.style == "green") || (sb.style == "blue")
				|| (sb.style == "orange")) {
			style = sb.style + '_';
		} else
			style = "";

		// 下拉框插件HTML代码
		var selectbutton = "<div class=\"" + style
				+ "dropdownbox\"><div class=\"" + style
				+ "select_the_radio\"  style=\"width:" + totalWidth + "px;\">"
				+ "<span><input style=\"width:" + buttonWidth
				+ "px;\" type=\"button\" currentValue=\"" + currentValue + "\" id=\"" + selectId + "\" value=\""
				+ defaultKey + "\" class=\"" + style
				+ "select_list_con\" onMouseDown=\"this.className='" + style
				+ "select_list_con2'\" onmouseout=\"this.className='" + style
				+ "select_list_con'\"/>" + "<input type=\"button\" id=\""
				+ arrowId + "\" value=\"\" class=\"" + style
				+ "select_list_arrow\" onMouseDown=\"this.className='" + style
				+ "select_list_arrow2'\" onmouseout=\"this.className='" + style
				+ "select_list_arrow'\"/></span></div>";

		var boxtop = "<div id=\"" + dropdownId + "\" class=\"" + style
				+ "jqsc_box\" style=\"width:" + listWidth
				+ "px; font-size:14px; color:#666; " + listDirection
				+ " display:none\">" + "<div class=\"" + style
				+ "jqsc_top\"><div class=\"" + style
				+ "jqsc_topleft\"></div><div class=\"" + style
				+ "jqsc_topcent\"></div><div class=\"" + style
				+ "jqsc_topright\"></div></div><div class=\"" + style
				+ "jqsc_cent\">";

		var boxlist = "<ul id=\"" + listId + "\" class=\"" + style
				+ "jqsc_list\" style=\"max-height:" + listHeight + "px;\">"
				+ optionTemplate + "</ul></div><div class=\"" + style
				+ "jqsc_bot\"><div class=\"" + style
				+ "jqsc_botleft\"></div><div class=\"" + style
				+ "jqsc_botcent\"></div><div class=\"" + style
				+ "jqsc_botright\"></div></div></div></div>";

		// 生成整个下拉框组件的HTML代码
		var dropdownTemplate = [ selectbutton, boxtop, boxlist ].join('');

		// 先清空原来div的内容再添加新的内容
		$(this).empty();
		$(this).append($(dropdownTemplate));

		// 下拉框组件添加鼠标点击事件
		$('#' + selectId + ',' + '#' + arrowId).click(function() {
			$('#' + dropdownId).toggle();
		});

		// 下拉框和li列表的鼠标移进移出事件
		$('#' + dropdownId).mouseleave(function() {
			$(this).hide();
		});
		$('#' + listId).children("li").mouseenter(function() {
			$(this).addClass("hov");
		});
		$('#' + listId).children("li").mouseout(function() {
			$(this).removeClass("hov");
		});

		// li列表点击事件
		$('#' + listId).children("li").click(function() {
			var _selectValue = $(this).attr('options_value');
			currentValue = _selectValue;
			$('#' + selectId).val($(this).text());
			$('#' + selectId).attr('currentValue', _selectValue);
			$('#' + listId).children("li").removeClass("current");
			$(this).addClass("current");
			$('#' + dropdownId).toggle();
			sb.change($(this).text(), _selectValue);
		});
	}
	});
})(jQuery);