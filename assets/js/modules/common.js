(function($) {
	"use strict";

    var common = {};
    mkd.modules.common = common;

    common.mkdFluidVideo = mkdFluidVideo;
    common.mkdEnableScroll = mkdEnableScroll;
    common.mkdDisableScroll = mkdDisableScroll;
    common.mkdOwlSlider = mkdOwlSlider;
    common.getLoadMoreData = getLoadMoreData;
    common.setLoadMoreAjaxData = setLoadMoreAjaxData;
    common.mkdPrettyPhoto = mkdPrettyPhoto;

    common.mkdOnDocumentReady = mkdOnDocumentReady;
    common.mkdOnWindowLoad = mkdOnWindowLoad;
    common.mkdOnWindowResize = mkdOnWindowResize;
    common.mkdOnWindowScroll = mkdOnWindowScroll;

    $(document).ready(mkdOnDocumentReady);
    $(window).load(mkdOnWindowLoad);
    $(window).resize(mkdOnWindowResize);
    $(window).scroll(mkdOnWindowScroll);
    
    /* 
        All functions to be called on $(document).ready() should be in this function
    */
    function mkdOnDocumentReady() {
	    mkdIconWithHover().init();
	    mkdIEversion();
	    mkdInitAnchor().init();
	    mkdInitBackToTop();
	    mkdBackButtonShowHide();
	    mkdInitSelfHostedVideoPlayer();
	    mkdSelfHostedVideoSize();
	    mkdFluidVideo();
	    mkdOwlSlider();
	    mkdPreloadBackgrounds();
	    mkdPrettyPhoto();
        mkdInitCustomMenuDropdown();
    }

    /* 
        All functions to be called on $(window).load() should be in this function
    */
    function mkdOnWindowLoad() {
        mkdSmoothTransition();
    }

    /* 
        All functions to be called on $(window).resize() should be in this function
    */
    function mkdOnWindowResize() {
        mkdSelfHostedVideoSize();
    }

    /* 
        All functions to be called on $(window).scroll() should be in this function
    */
    function mkdOnWindowScroll() {
        
    }
	
	/*
	 * IE version
	 */
	function mkdIEversion() {
		var ua = window.navigator.userAgent;
		var msie = ua.indexOf("MSIE ");
		
		if (msie > 0) {
			var version = parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)));
			mkd.body.addClass('mkd-ms-ie'+version);
		}
		return false;
	}
	
	function mkdDisableScroll() {
		if (window.addEventListener) {
			window.addEventListener('DOMMouseScroll', mkdWheel, false);
		}
		
		window.onmousewheel = document.onmousewheel = mkdWheel;
		document.onkeydown = mkdKeydown;
	}
	
	function mkdEnableScroll() {
		if (window.removeEventListener) {
			window.removeEventListener('DOMMouseScroll', mkdWheel, false);
		}
		
		window.onmousewheel = document.onmousewheel = document.onkeydown = null;
	}
	
	function mkdWheel(e) {
		mkdPreventDefaultValue(e);
	}
	
	function mkdKeydown(e) {
		var keys = [37, 38, 39, 40];
		
		for (var i = keys.length; i--;) {
			if (e.keyCode === keys[i]) {
				mkdPreventDefaultValue(e);
				return;
			}
		}
	}
	
	function mkdPreventDefaultValue(e) {
		e = e || window.event;
		if (e.preventDefault) {
			e.preventDefault();
		}
		e.returnValue = false;
	}
	
	/*
	 **	Anchor functionality
	 */
	var mkdInitAnchor = function() {
		/**
		 * Set active state on clicked anchor
		 * @param anchor, clicked anchor
		 */
		var setActiveState = function(anchor){
			
			$('.mkd-main-menu .mkd-active-item, .mkd-mobile-nav .mkd-active-item, .mkd-fullscreen-menu .mkd-active-item').removeClass('mkd-active-item');
			anchor.parent().addClass('mkd-active-item');
			
			$('.mkd-main-menu a, .mkd-mobile-nav a, .mkd-fullscreen-menu a').removeClass('current');
			anchor.addClass('current');
		};
		
		/**
		 * Check anchor active state on scroll
		 */
		var checkActiveStateOnScroll = function(){
			
			$('[data-mkd-anchor]').waypoint( function(direction) {
				if(direction === 'down') {
					setActiveState($("a[href='"+window.location.href.split('#')[0]+"#"+$(this.element).data("mkd-anchor")+"']"));
				}
			}, { offset: '50%' });
			
			$('[data-mkd-anchor]').waypoint( function(direction) {
				if(direction === 'up') {
					setActiveState($("a[href='"+window.location.href.split('#')[0]+"#"+$(this.element).data("mkd-anchor")+"']"));
				}
			}, { offset: function(){
				return -($(this.element).outerHeight() - 150);
			} });
			
		};
		
		/**
		 * Check anchor active state on load
		 */
		var checkActiveStateOnLoad = function(){
			var hash = window.location.hash.split('#')[1];
			
			if(hash !== "" && $('[data-mkd-anchor="'+hash+'"]').length > 0){
				anchorClickOnLoad(hash);
			}
		};
		
		/**
		 * Handle anchor on load
		 */
		var anchorClickOnLoad = function($this) {
			var scrollAmount;
			var anchor = $('a');
			var hash = $this;
			if(hash !== "" && $('[data-mkd-anchor="' + hash + '"]').length > 0 ) {
				var anchoredElementOffset = $('[data-mkd-anchor="' + hash + '"]').offset().top;
				scrollAmount = $('[data-mkd-anchor="' + hash + '"]').offset().top - headerHeihtToSubtract(anchoredElementOffset) - mkdGlobalVars.vars.mkdAddForAdminBar;
				
				setActiveState(anchor);
				
				mkd.html.stop().animate({
					scrollTop: Math.round(scrollAmount)
				}, 1000, function() {
					//change hash tag in url
					if(history.pushState) { history.pushState(null, null, '#'+hash); }
				});
				return false;
			}
		};
		
		/**
		 * Calculate header height to be substract from scroll amount
		 * @param anchoredElementOffset, anchorded element offest
		 */
		var headerHeihtToSubtract = function(anchoredElementOffset){
			
			if(mkd.modules.header.behaviour === 'mkd-sticky-header-on-scroll-down-up') {
				mkd.modules.header.isStickyVisible = (anchoredElementOffset > mkd.modules.header.stickyAppearAmount);
			}
			
			if(mkd.modules.header.behaviour === 'mkd-sticky-header-on-scroll-up') {
				if((anchoredElementOffset > mkd.scroll)){
					mkd.modules.header.isStickyVisible = false;
				}
			}
			
			var headerHeight = mkd.modules.header.isStickyVisible ? mkdGlobalVars.vars.mkdStickyHeaderTransparencyHeight : mkdPerPageVars.vars.mkdHeaderTransparencyHeight;
			
			if(mkd.windowWidth < 1025) {
				headerHeight = 0;
			}
			
			return headerHeight;
		};
		
		/**
		 * Handle anchor click
		 */
		var anchorClick = function() {
			mkd.document.on("click", ".mkd-main-menu a, .mkd-fullscreen-menu a, .mkd-btn, .mkd-anchor, .mkd-mobile-nav a", function() {
				var scrollAmount;
				var anchor = $(this);
				var hash = anchor.prop("hash").split('#')[1];
				
				if(hash !== "" && $('[data-mkd-anchor="' + hash + '"]').length > 0 ) {
					
					var anchoredElementOffset = $('[data-mkd-anchor="' + hash + '"]').offset().top;
					scrollAmount = $('[data-mkd-anchor="' + hash + '"]').offset().top - headerHeihtToSubtract(anchoredElementOffset) - mkdGlobalVars.vars.mkdAddForAdminBar;
					
					setActiveState(anchor);
					
					mkd.html.stop().animate({
						scrollTop: Math.round(scrollAmount)
					}, 1000, function() {
						//change hash tag in url
						if(history.pushState) { history.pushState(null, null, '#'+hash); }
					});
					return false;
				}
			});
		};
		
		return {
			init: function() {
				if($('[data-mkd-anchor]').length) {
					anchorClick();
					checkActiveStateOnScroll();
					$(window).load(function() { checkActiveStateOnLoad(); });
				}
			}
		};
	};
	
	function mkdInitBackToTop(){
		var backToTopButton = $('#mkd-back-to-top');
		backToTopButton.on('click',function(e){
			e.preventDefault();
			mkd.html.animate({scrollTop: 0}, mkd.window.scrollTop()/3, 'linear');
		});
	}
	
	function mkdBackButtonShowHide(){
		mkd.window.scroll(function () {
			var b = $(this).scrollTop();
			var c = $(this).height();
			var d;
			if (b > 0) { d = b + c / 2; } else { d = 1; }
			if (d < 1e3) { mkdToTopButton('off'); } else { mkdToTopButton('on'); }
		});
	}
	
	function mkdToTopButton(a) {
		var b = $("#mkd-back-to-top");
		b.removeClass('off on');
		if (a === 'on') { b.addClass('on'); } else { b.addClass('off'); }
	}
	
	function mkdInitSelfHostedVideoPlayer() {
		var players = $('.mkd-self-hosted-video');
		
		if(players.length) {
			players.mediaelementplayer({
				audioWidth: '100%'
			});
		}
	}
	
	function mkdSelfHostedVideoSize(){
		var selfVideoHolder = $('.mkd-self-hosted-video-holder .mkd-video-wrap');
		
		if(selfVideoHolder.length) {
			selfVideoHolder.each(function(){
				var thisVideo = $(this),
					videoWidth = thisVideo.closest('.mkd-self-hosted-video-holder').outerWidth(),
					videoHeight = videoWidth / mkd.videoRatio;
				
				if(navigator.userAgent.match(/(Android|iPod|iPhone|iPad|IEMobile|Opera Mini)/)){
					thisVideo.parent().width(videoWidth);
					thisVideo.parent().height(videoHeight);
				}
				
				thisVideo.width(videoWidth);
				thisVideo.height(videoHeight);
				
				thisVideo.find('video, .mejs-overlay, .mejs-poster').width(videoWidth);
				thisVideo.find('video, .mejs-overlay, .mejs-poster').height(videoHeight);
			});
		}
	}
	
	function mkdFluidVideo() {
        fluidvids.init({
			selector: ['iframe'],
			players: ['www.youtube.com', 'player.vimeo.com']
		});
	}

    function mkdSmoothTransition() {

        if (mkd.body.hasClass('mkd-smooth-page-transitions')) {

            //check for preload animation
            if (mkd.body.hasClass('mkd-smooth-page-transitions-preloader')) {
                var loader = $('body > .mkd-smooth-transition-loader.mkd-mimic-ajax');
                loader.fadeOut(500);
                $(window).bind("pageshow", function (event) {
                    if (event.originalEvent.persisted) {
                        loader.fadeOut(500);
                    }
                });
            }

            //check for fade out animation
            if(mkd.body.hasClass('mkd-smooth-page-transitions-fadeout')) {
                $('a').click(function (e) {
                    var a = $(this);

                    if ((a.parents('.mkd-shopping-cart-dropdown').length || a.parent('.product-remove').length) && a.hasClass('remove') || a.hasClass('mkd-no-smooth-transitions')) {
                        return;
                    }

                    if (
                        e.which == 1 && // check if the left mouse button has been pressed
                        a.attr('href').indexOf(window.location.host) >= 0 && // check if the link is to the same domain
                        (typeof a.data('rel') === 'undefined') && //Not pretty photo link
                        (typeof a.attr('rel') === 'undefined') && //Not VC pretty photo link
                        (typeof a.attr('target') === 'undefined' || a.attr('target') === '_self') && // check if the link opens in the same window
                        (a.attr('href').split('#')[0] !== window.location.href.split('#')[0]) // check if it is an anchor aiming for a different page
                    ) {
                        e.preventDefault();
                        $('.mkd-wrapper-inner, #multiscroll-nav').fadeOut(1000, function () {
                            window.location = a.attr('href');
                        });
                    }
                });
            }
        }
    }
	
	/*
	 *	Preload background images for elements that have 'mkd-preload-background' class
	 */
	function mkdPreloadBackgrounds(){
		var preloadBackHolder = $('.mkd-preload-background');
		
		if(preloadBackHolder.length) {
			preloadBackHolder.each(function() {
				var preloadBackground = $(this);
				
				if(preloadBackground.css("background-image") !== "" && preloadBackground.css("background-image") != "none") {
					var bgUrl = preloadBackground.attr('style');
					
					bgUrl = bgUrl.match(/url\(["']?([^'")]+)['"]?\)/);
					bgUrl = bgUrl ? bgUrl[1] : "";
					
					if (bgUrl) {
						var backImg = new Image();
						backImg.src = bgUrl;
						$(backImg).load(function(){
							preloadBackground.removeClass('mkd-preload-background');
						});
					}
				} else {
					$(window).load(function(){ preloadBackground.removeClass('mkd-preload-background'); }); //make sure that mkd-preload-background class is removed from elements with forced background none in css
				}
			});
		}
	}
	
	function mkdPrettyPhoto() {
		/*jshint multistr: true */
		var markupWhole = '<div class="pp_pic_holder"> \
                        <div class="ppt">&nbsp;</div> \
                        <div class="pp_top"> \
                            <div class="pp_left"></div> \
                            <div class="pp_middle"></div> \
                            <div class="pp_right"></div> \
                        </div> \
                        <div class="pp_content_container"> \
                            <div class="pp_left"> \
                            <div class="pp_right"> \
                                <div class="pp_content"> \
                                    <div class="pp_loaderIcon"></div> \
                                    <div class="pp_fade"> \
                                        <a href="#" class="pp_expand" title="Expand the image">Expand</a> \
                                        <div class="pp_hoverContainer"> \
                                            <a class="pp_next" href="#"><span class="fa fa-angle-right"></span></a> \
                                            <a class="pp_previous" href="#"><span class="fa fa-angle-left"></span></a> \
                                        </div> \
                                        <div id="pp_full_res"></div> \
                                        <div class="pp_details"> \
                                            <div class="pp_nav"> \
                                                <a href="#" class="pp_arrow_previous">Previous</a> \
                                                <p class="currentTextHolder">0/0</p> \
                                                <a href="#" class="pp_arrow_next">Next</a> \
                                            </div> \
                                            <p class="pp_description"></p> \
                                            {pp_social} \
                                            <a class="pp_close" href="#">Close</a> \
                                        </div> \
                                    </div> \
                                </div> \
                            </div> \
                            </div> \
                        </div> \
                        <div class="pp_bottom"> \
                            <div class="pp_left"></div> \
                            <div class="pp_middle"></div> \
                            <div class="pp_right"></div> \
                        </div> \
                    </div> \
                    <div class="pp_overlay"></div>';
		
		$("a[data-rel^='prettyPhoto']").prettyPhoto({
			hook: 'data-rel',
			animation_speed: 'normal', /* fast/slow/normal */
			slideshow: false, /* false OR interval time in ms */
			autoplay_slideshow: false, /* true/false */
			opacity: 0.80, /* Value between 0 and 1 */
			show_title: true, /* true/false */
			allow_resize: true, /* Resize the photos bigger than viewport. true/false */
			horizontal_padding: 0,
			default_width: 960,
			default_height: 540,
			counter_separator_label: '/', /* The separator for the gallery counter 1 "of" 2 */
			theme: 'pp_default', /* light_rounded / dark_rounded / light_square / dark_square / facebook */
			hideflash: false, /* Hides all the flash object on a page, set to TRUE if flash appears over prettyPhoto */
			wmode: 'opaque', /* Set the flash wmode attribute */
			autoplay: true, /* Automatically start videos: True/False */
			modal: false, /* If set to true, only the close button will close the window */
			overlay_gallery: false, /* If set to true, a gallery will overlay the fullscreen image on mouse over */
			keyboard_shortcuts: true, /* Set to false if you open forms inside prettyPhoto */
			deeplinking: false,
			custom_markup: '',
			social_tools: false,
			markup: markupWhole
		});
	}
	
	/**
	 * Initializes load more data params
	 * @param container with defined data params
	 * return array
	 */
	function getLoadMoreData(container){
		var dataList = container.data(),
			returnValue = {};
		
		for (var property in dataList) {
			if (dataList.hasOwnProperty(property)) {
				if (typeof dataList[property] !== 'undefined' && dataList[property] !== false) {
					returnValue[property] = dataList[property];
				}
			}
		}
		
		return returnValue;
	}
	
	/**
	 * Sets load more data params for ajax function
	 * @param container with defined data params
	 * return array
	 */
	function setLoadMoreAjaxData(container, action){
		var returnValue = {
			action: action
		};
		
		for (var property in container) {
			if (container.hasOwnProperty(property)) {
				
				if (typeof container[property] !== 'undefined' && container[property] !== false) {
					returnValue[property] = container[property];
				}
			}
		}
		
		return returnValue;
	}
	
	/**
	 * Object that represents icon with hover data
	 * @returns {{init: Function}} function that initializes icon's functionality
	 */
	var mkdIconWithHover = function() {
		//get all icons on page
		var icons = $('.mkd-icon-has-hover');
		
		/**
		 * Function that triggers icon hover color functionality
		 */
		var iconHoverColor = function(icon) {
			if(typeof icon.data('hover-color') !== 'undefined') {
				var changeIconColor = function(event) {
					event.data.icon.css('color', event.data.color);
				};
				
				var hoverColor = icon.data('hover-color'),
					originalColor = icon.css('color');
				
				if(hoverColor !== '') {
					icon.on('mouseenter', {icon: icon, color: hoverColor}, changeIconColor);
					icon.on('mouseleave', {icon: icon, color: originalColor}, changeIconColor);
				}
			}
		};
		
		return {
			init: function() {
				if(icons.length) {
					icons.each(function() {
						iconHoverColor($(this));
					});
				}
			}
		};
	};

    /**
     * Init Owl Carousel
     */
    function mkdOwlSlider() {
        var sliders = $('.mkd-owl-slider');

        if (sliders.length) {
            sliders.each(function(){
                var slider = $(this),
                    slideItemsNumber = slider.children().length,
                    numberOfItems = 1,
                    loop = true,
                    autoplay = true,
                    autoplayHoverPause = true,
                    sliderSpeed = 3500,
                    sliderSpeedAnimation = 600,
                    margin = 0,
                    center = false,
                    autoWidth = false,
                    animateIn = false, // keyframe css animation
                    animateOut = false, // keyframe css animation
                    navigation = true,
                    pagination = false;

                if (typeof slider.data('number-of-items') !== 'undefined' && slider.data('number-of-items') !== false) {
                    numberOfItems = slider.data('number-of-items');
                }
                if (slider.data('enable-loop') === 'no') {
                    loop = false;
                }
                if (slider.data('enable-autoplay') === 'no') {
                    autoplay = false;
                }
                if (slider.data('enable-autoplay-hover-pause') === 'no') {
                    autoplayHoverPause = false;
                }
                if (typeof slider.data('slider-speed') !== 'undefined' && slider.data('slider-speed') !== false) {
                    sliderSpeed = slider.data('slider-speed');
                }
                if (typeof slider.data('slider-speed-animation') !== 'undefined' && slider.data('slider-speed-animation') !== false) {
                    sliderSpeedAnimation = slider.data('slider-speed-animation');
                }
                if (typeof slider.data('slider-margin') !== 'undefined' && slider.data('slider-margin') !== false) {
                    margin = slider.data('slider-margin');
                }
                if(slider.parent().hasClass('mkd-normal-space')) {
                    margin = 30;
                } else if (slider.parent().hasClass('mkd-small-space')) {
                    margin = 20;
                } else if (slider.parent().hasClass('mkd-tiny-space')) {
                    margin = 10;
                }
                if (slider.data('enable-center') === 'yes') {
                    center = true;
                }
                if (slider.data('enable-auto-width') === 'yes') {
                    autoWidth = true;
                }
                if (typeof slider.data('slider-animate-in') !== 'undefined' && slider.data('slider-animate-in') !== false) {
                    animateIn = slider.data('slider-animate-in');
                }
                if (typeof slider.data('slider-animate-out') !== 'undefined' && slider.data('slider-animate-out') !== false) {
                    animateOut = slider.data('slider-animate-out');
                }
                if (slider.data('enable-navigation') === 'no') {
                    navigation = false;
                }
                if (slider.data('enable-pagination') === 'yes') {
                    pagination = true;
                }

                if(navigation && pagination) {
                    slider.addClass('mkd-slider-has-both-nav');
                }

                if (slideItemsNumber <= 1) {
                    loop       = false;
                    autoplay   = false;
                    navigation = false;
                    pagination = false;
                }

                var responsiveNumberOfItems1 = 1,
                    responsiveNumberOfItems2 = 2,
                    responsiveNumberOfItems3 = 3;

                if (numberOfItems < 3) {
                    responsiveNumberOfItems2 = numberOfItems;
                    responsiveNumberOfItems3 = numberOfItems;
                }

                slider.owlCarousel({
                    items: numberOfItems,
                    loop: loop,
                    autoplay: autoplay,
                    autoplayHoverPause: autoplayHoverPause,
                    autoplayTimeout: sliderSpeed,
                    autoplaySpeed: 650,
                    margin: margin,
                    center: center,
                    autoWidth: autoWidth,
                    animateIn : animateIn,
                    animateOut : animateOut,
                    dots: pagination,
                    nav: navigation,
                    navText: [
                        '<span class="mkd-prev-icon"><span class="mkd-icon-linear-icon lnr lnr-arrow-left"></span></span>',
                        '<span class="mkd-next-icon"><span class="mkd-icon-linear-icon lnr lnr-arrow-right"></span></span>'
                    ],
                    responsive: {
                        0: {
                            items: responsiveNumberOfItems1,
                            slideBy: responsiveNumberOfItems1,
                            margin: 0,
                            center: false,
                            autoWidth: false,
                        },
                        680: {
                            items: responsiveNumberOfItems1,
                            slideBy: responsiveNumberOfItems1,
                        },
                        768: {
                            items: responsiveNumberOfItems2,
                            slideBy: responsiveNumberOfItems2,
                        },
                        1024: {
                            items: numberOfItems,
                            slideBy: numberOfItems,
                        }
                    },
                    onInitialize: function () {
                        slider.css('visibility', 'visible');
                    }
                });
            });
        }
    }

    function mkdInitCustomMenuDropdown() {

    	var menus = $('.mkd-sidebar .widget_nav_menu .menu');


        var dropdownOpeners,
            currentMenu;


        if (menus.length) {
            menus.each(function () {

                currentMenu = $(this);

                dropdownOpeners = currentMenu.find('li.menu-item-has-children > a');

                if (dropdownOpeners.length) {
                    dropdownOpeners.each(function () {
                        var currentDropdownOpener = $(this);

                        if (currentDropdownOpener.parent().hasClass('current-menu-parent')) {
                            currentDropdownOpener.addClass('mkd-custom-menu-active');
                        }

                        currentDropdownOpener.on('click', function (e) {
                            e.preventDefault();
                            var currentDropdownOpenerActive = $(this);
                            var dropdownToOpen = currentDropdownOpenerActive.parent().children('.sub-menu');

                            if (!currentDropdownOpenerActive.hasClass('mkd-custom-menu-active')) {

                                if (!$(this).parent().parent().hasClass('sub-menu')) { //if first level
                                    dropdownOpeners.each(function () {

                                        $(this).removeClass('mkd-custom-menu-active');
                                        $(this).parent().children('.sub-menu').slideUp();

                                    });
                                }

                                dropdownToOpen.slideDown();
                                currentDropdownOpenerActive.addClass('mkd-custom-menu-active');
                            }

                            else {
                                if ($(this).parent().parent().hasClass('sub-menu')) {
                                    dropdownToOpen.slideUp();
                                    currentDropdownOpenerActive.removeClass('mkd-custom-menu-active');
                                }
                            }
                        });
                    });
                }
            });
        }
    }

})(jQuery);