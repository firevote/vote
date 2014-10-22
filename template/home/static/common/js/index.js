$(function() {
    //顶部导航
    $("div.navbar-fixed-top").autoHidingNavbar();

	//	二级导航
	$(".menu-sub a").hover(function(){
		$(this).stop().animate({opacity:1},100);
	},function(){
		$(this).stop().animate({opacity:0.8},100);
	});

    //彩带
    var _index0 = $('#indexg0'),_indexdefault = {x:_index0.offset().left,y:_index0.offset().top};
    var _index1 = $('#indexg1'),_indexdefault1 = {x:_index1.offset().left,y:_index1.offset().top};
    var _index2 = $('#indexg2'),_indexdefault2 = {x:_index2.offset().left,y:_index2.offset().top};
    var _index3 = $('#indexg3'),_indexdefault3 = {x:_index3.offset().left,y:_index3.offset().top};
    var _ff = 0.05;
    $('body').on('mousemove',function(e){
        _index0.css('left',_indexdefault.x+(e.pageX*_ff))
        _index0.css('top',_indexdefault.y+(e.pageY*_ff))
    })
    $('body').on('mousemove',function(e){
        _index1.css('left',_indexdefault1.x+(e.pageX*_ff))
        _index1.css('top',_indexdefault1.y+(e.pageY*_ff))
    })
    $('body').on('mousemove',function(e){
        _index2.css('right',_indexdefault2.x+(e.pageX*_ff))
        _index2.css('top',_indexdefault2.y+(e.pageY*_ff))
    })
    $('body').on('mousemove',function(e){
        _index3.css('right',_indexdefault3.x+(e.pageX*_ff))
        _index3.css('top',_indexdefault3.y+(e.pageY*_ff))
    })

});