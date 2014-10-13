/**
 * jquery_pager插件
 * 
 * @name jquery_pager插件
 * @package IFLYBookShop
 * @link iflybookshop/js/lib/jquery_pager
 * @author xyyuan
 * @version 1.0
 * @created 8-Oct-2013
 * 
 */

(function($) {
	$.fn
			.extend({
				pager : function(setting) {
					// 提供方法 dropdown("currentValue") 可返回当前选中的currentValue
					if (setting == "currentValue") {
						var _pageId = $(this).selector.substr(1) + "_pager";
						return $('#' + _pageId).attr('currentValue');
					}
					// 将外部获取的setting参数添加到默认设置中
					var sb = $.extend({
						// 分页数据
						total : 1,
						// 分页大小
						size : 1,
						// 默认值
						value : 1,
						// 点击选项后的事件
						click : function(value) {
						}
					}, setting);

					// 获取当前容器的名称，作为前缀用来生成各个标签的id，防止重复
					var container = $(this).selector;
					container = container.substr(1);
					// 根据容器名称生成唯一的id table标签需要一个id
					var pagerId = container + "_pager";

					// 计算分页插件的状态
					var self = this;
					var totalPage = parseInt(Math.ceil(sb.total / sb.size));
					// 如果totalPage == 0 则默认totalPage = 1
					if (totalPage == 0)
						totalPage = 1;
					var first = 1;
					var last = totalPage;
					var value = sb.value;
					// 判断value的值是否在允许范围内
					if (value < 1)
						value = 1;
					else if (value >= totalPage)
						value = totalPage;
					// 生成HTML代码
					var html_str = generateHTML(pagerId, value, totalPage);
					$(self).empty();
					$(self).append($(html_str));

					// 添加按钮的事件响应
					$('#' + pagerId + ' input[type=button]').click(
							function setInputClick() {
								var select = $(this).attr('value');
								if (select == '上一页') {
									value--;
									if (value < 1)
										value = 1;
								} else if (select == '下一页') {
									value++;
									if (value > totalPage)
										value = totalPage;
								} else if (select != '...') {
									value = parseInt(select);
								}
								sb.click(value);
								var html_str = generateHTML(pagerId, value,
										totalPage);
								$(self).empty();
								$(self).append($(html_str));
								$('#' + pagerId + ' input[type=button]').click(
										setInputClick);
							});

					// 生成分页控件HTML代码的函数
					function generateHTML(pagerId, value, totalPage) {
						// HTML头标签代码
						html_header = "<table class=\"table_bot2\" id = \""
								+ pagerId
								+ "\" currentValue = \""
								+ value
								+ "\"><td align=\"center\" class=\"t_cen ml20\" width=\"51%\">";
						// 页数大于9页 需要添加省略号
						if (totalPage > 9) {
							// 总页数大于9页，需要显示省略号
							// 计算begin,end,leftEllipsis,rightEllipsis
							if ((value <= 5) && (value >= 1)) {
								begin = 2;
								end = 8;
								leftEllipsis = false;
								rightEllipsis = true;
							} else if ((value <= totalPage)
									&& (value >= totalPage - 4)) {
								begin = totalPage - 7;
								end = totalPage - 1;
								leftEllipsis = true;
								rightEllipsis = false;
							} else {
								begin = value - 3;
								end = value + 3;
								leftEllipsis = true;
								rightEllipsis = true;
							}
							// 总页数信息
							html_str = html_header + "<span>共" + totalPage
									+ "页</span>";
							// 判断是否需要上一页灰显
							if (value == 1) {
								html_str += "<input type=\"button\" value=\"上一页\" class=\"page_btn2dis\" onMouseover=\"this.className='page_btn2dis'\" onmouseout=\"this.className='page_btn2dis'\">";
								// 显示选中的1
								html_str += "<input type=\"button\" value=\""
										+ 1
										+ "\" class=\"page_btn3pre\" onMouseover=\"this.className='page_btn3hov'\" onmouseout=\"this.className='page_btn3pre'\">";
							} else {
								html_str += "<input type=\"button\" value=\"上一页\" class=\"page_btn2nor\" onMouseover=\"this.className='page_btn2hov'\" onmouseout=\"this.className='page_btn2nor'\">";
								// 显示没有选中的1
								html_str += "<input type=\"button\" value=\""
										+ 1
										+ "\" class=\"page_btn3nor\" onMouseover=\"this.className='page_btn3hov'\" onmouseout=\"this.className='page_btn3nor'\">";
							}
							// 判断是否需要左边的省略号
							if (leftEllipsis == true)
								html_str += "<input type=\"button\" value=\"...\" class=\"page_btn3nor\" onMouseover=\"this.className='page_btn3nor'\" onmouseout=\"this.className='page_btn3nor'\">";
							// 中间部分的按钮
							var i = 0;
							for (i = begin; i <= end; i++) {
								if (i == value)
									html_str += "<input type=\"button\" value=\""
											+ i
											+ "\" class=\"page_btn3pre\" onMouseover=\"this.className='page_btn3hov'\" onmouseout=\"this.className='page_btn3pre'\">";
								else
									html_str += "<input type=\"button\" value=\""
											+ i
											+ "\" class=\"page_btn3nor\" onMouseover=\"this.className='page_btn3hov'\" onmouseout=\"this.className='page_btn3nor'\">";
							}
							// 判断是否需要右边的省略号
							if (rightEllipsis == true)
								html_str += "<input type=\"button\" value=\"...\" class=\"page_btn3nor\" onMouseover=\"this.className='page_btn3nor'\" onmouseout=\"this.className='page_btn3nor'\">";

							// 判断是否需要下一页灰显
							if (value == totalPage) {
								// 显示选中的最后一页页码
								html_str += "<input type=\"button\" value=\""
										+ totalPage
										+ "\" class=\"page_btn3pre\" onMouseover=\"this.className='page_btn3hov'\" onmouseout=\"this.className='page_btn3pre'\">";
								html_str += "<input type=\"button\" value=\"下一页\" class=\"page_btn2dis\" onMouseover=\"this.className='page_btn2dis'\" onmouseout=\"this.className='page_btn2dis'\">";
							} else {
								// 显示未选中的最后一页页码
								html_str += "<input type=\"button\" value=\""
										+ totalPage
										+ "\" class=\"page_btn3nor\" onMouseover=\"this.className='page_btn3hov'\" onmouseout=\"this.className='page_btn3nor'\">";
								html_str += "<input type=\"button\" value=\"下一页\" class=\"page_btn2nor\" onMouseover=\"this.className='page_btn2hov'\" onmouseout=\"this.className='page_btn2nor'\">";
							}
							// 添加尾部
							html_str += "</td></table>";
						} else {
							// 总页数小于9页，显示全部
							i = 0;
							html_str = html_header + "<span>共" + totalPage
									+ "页</span>";
							// 判断是否需要上一页灰显
							if (value == 1) {
								html_str += "<input type=\"button\" value=\"上一页\" class=\"page_btn2dis\" onMouseover=\"this.className='page_btn2dis'\" onmouseout=\"this.className='page_btn2dis'\">";
							} else {
								html_str += "<input type=\"button\" value=\"上一页\" class=\"page_btn2nor\" onMouseover=\"this.className='page_btn2hov'\" onmouseout=\"this.className='page_btn2nor'\">";
							}
							// 中间部分HTML代码
							for (i = 1; i <= totalPage; i++) {
								if (i == value)
									html_str += "<input type=\"button\" value=\""
											+ i
											+ "\" class=\"page_btn3pre\" onMouseover=\"this.className='page_btn3hov'\" onmouseout=\"this.className='page_btn3pre'\">";
								else
									html_str += "<input type=\"button\" value=\""
											+ i
											+ "\" class=\"page_btn3nor\" onMouseover=\"this.className='page_btn3hov'\" onmouseout=\"this.className='page_btn3nor'\">";
							}
							// 判断是否需要下一页灰显
							if (value == totalPage) {
								html_str += "<input type=\"button\" value=\"下一页\" class=\"page_btn2dis\" onMouseover=\"this.className='page_btn2dis'\" onmouseout=\"this.className='page_btn2dis'\">";
							} else {
								html_str += "<input type=\"button\" value=\"下一页\" class=\"page_btn2nor\" onMouseover=\"this.className='page_btn2hov'\" onmouseout=\"this.className='page_btn2nor'\">";
							}
							// 添加尾部
							html_str += "</td></table>";
						}
						return html_str;
					}
				}
			});
})(jQuery);