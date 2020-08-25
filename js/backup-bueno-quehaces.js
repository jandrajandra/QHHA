$.extend($.expr[":"], {
	"containsNC": function(elem, i, match, array) {
	return (elem.textContent || elem.innerText || "").toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;
	}
});

var QHHA = {
	/* variables */
	ejes: [ 'seg', 'urb', 'eco', 'efi', 'pub', 'med' ],
	imgDir: '/img/icons/',
	zapGdl: 'gdl',
	ejesFull: {
		seg: {label:'Seguridad', shortLabel:'Seguridad', id:'seguridad', color:'#193071'},
		urb: {label:'Desarrollo Urbano', id:'desarrollo-urbano', color:'#193071'},
		eco: {label:'Economía', id:'desarrollo-economico', color:'#193071'},
		efi: {label:'Educación', id:'eficiencia', color:'#193071'},
		pub: {label:'Servicios Públicos', id:'servicios-publicos', color:'#193071'},
		med: {label:'Medio Ambiente', id:'medio-ambiente', color:'#193071'}
	},

	boot:function() {
		QHHA.build.boot();
		QHHA.screen.boot();
		QHHA.search.boot();
		QHHA.fx.dockZoom.boot();
		QHHA.fx.scroll.boot();
		//QHHA.fx.slide.boot();

		$('#header .top, #menu a:first').click( QHHA.toTop );
		$('.showIconCredits').click(function() {$('.creditList').toggle()});
		QHHA.zapGdl = $('body').data('zapgdl');
	},

	search: {
		boot:function() {
			$('#search form').submit( QHHA.search.submit );
			$('#search form .query').keyup( QHHA.search.submit );
		},
		submit:function() { var query = $('form .query').val(), results = [];
			$('#ejes li.indicador .descripción:containsNC('+query+')').each(function() {
				results.push( $(this).parents('li.indicador').clone() );
			});
			$('#search .results').html('').append( results );
			return false;
		}
	},

	/* Visual EFFECTS */
	fx:{
		scroll:{
			boot:function() { var scroll = QHHA.fx.scroll;
				scroll.sr = ScrollReveal({mobile:true, reset:true});
				scroll.bienvenida();
				scroll.flor();
				scroll.fuentes();
				scroll.logos();
			},
			bienvenida:function() { var sr = QHHA.fx.scroll.sr;
				sr.reveal('#bienvenida .municipio.zap', {
					origin:'left', delay:600
				});
				sr.reveal('#bienvenida .municipio.gdl', {
					origin:'right', delay:600
				});
				sr.reveal('#bienvenida img.zap', {
					origin:'right', delay:1000
				});
				sr.reveal('#bienvenida img.gdl', {
					origin:'left', delay:1000
				});
				sr.reveal('#bienvenida .municipio img.mouseout', {
					delay:1000
				});
			},
			fuentes:function() { var sr = QHHA.fx.scroll.sr;
				sr.reveal('#fuentes .pages a', {
					delay:600
				});
			},
			logos:function() { var sr = QHHA.fx.scroll.sr;
				sr.reveal('.logoList a', {
					delay:600
				}, 50);
			},
			flor:function() { var sr = QHHA.fx.scroll.sr;
				sr.reveal('.flor .icon', {
					delay:500
				});
				sr.reveal('.flor span.seg, .flor span.urb, .flor span.com', {
					delay:1000, duration:1000, scale:0.6, origin:'left'
				});
				sr.reveal('.flor span.eco, .flor span.efi, .flor span.pub, .flor span.med', {
					delay:1000, duration:1000, scale:0.6, origin:'right'
				});
			}
		},
		slide:{
			boot:function() {
				QHHA.fx.scroll.sr.reveal('.slide', {
					duration:1200,
					scale:0.6,
					viewFactor:0.3,
					distance:'5em',
					//reset:false,
					beforeReveal:QHHA.fx.slide.transition
				});
			},
			transition:function(domEl) { var slide = $(domEl);

				var bgColor = slide.data('background');

				$('body').css('background-color', bgColor);

				if( slide.data('bkgimage') || (slide.attr('id') && slide.hasClass('eje')) ) {
					$('body').css('background-image', 'url(/img/gradients/'+(slide.data('bkgimage')||slide.attr('id'))+'.png)');
				} else {
					$('body').css('background-image', 'none');
				}

				$('#menu a').removeClass('here').filter("[href='#"+slide.attr('id')+"']").addClass('here');
			}
		},
		dockZoom: {
			boot:function() {
				$('.sponsors a, #inicio .logos a').hover( QHHA.fx.dockZoom.over, QHHA.fx.dockZoom.out );
			},
			over:function() {
				QHHA.fx.dockZoom.out.apply(this);
				$(this).addClass('zoomed').prev().addClass('zoomedAdj').next().next().addClass('zoomedAdj');
			},
			out:function() {
				$(this).add($(this).siblings()).removeClass('zoomed zoomedAdj');
			}
		}
	},

	toTop:function() {
		event.preventDefault();
		$('html, body').stop().animate({
			scrollTop: 0
		}, 1000);
		history.pushState('', document.title, window.location.pathname);
		return void(0);
	},

	days:{
		since:function() {
			var dias = Math.ceil((new Date() - new Date("2015/October/1"))/(1e3*60*60*24)),
				total = (new Date("2018/September/30") - new Date("2015/October/1"))/(1e3*60*60*24),
				porcentaje = Math.ceil((dias*100)/total);
			$('#alcalde .inicioFin').find('.dias i').text(dias).end().
				find('.porcentaje i').text(porcentaje);
		}
	},

	/* BUILD */
	build:{
		boot:function() {
			this.indice();
			this.ejes();
		},
		goToInnerLink:function() {
			location.href = $(this).find('big a').attr('href');
		},
		indice:function() { var indice = $('#indice ul.indice');
			$.each(QHHA.ejes, function(i) { var eje = {name:this+''},
					indizado = $('#template .indizado').clone();
				eje.full = QHHA.ejesFull[ eje.name ];

				indizado.addClass( eje.name + ( ((i%2 == 0) && (i != 6)) ? ' right' : '')).
					find('img').attr('src', QHHA.imgDir+eje.name+'.png').end().
					find('big a').attr('href', '#'+eje.full.id).text(eje.full.shortLabel || eje.full.label);
				indice.append( indizado );
				indice.append( '<br  '+(((i+1)%2 == 0) ? '' : 'class="onlyInPortrait"')+' />' );
				indizado.click( QHHA.build.goToInnerLink );
			});
		},
		ejes:function() { var ejes = $('#ejes');
			$.each(QHHA.ejes, function(i) { var eje = {name:this+''};
				eje.template = $('#template .eje').clone();
				eje.full = QHHA.ejesFull[ eje.name ];

				eje.template.data('background', eje.full.color).addClass( eje.name ).attr('id', eje.full.id).
					find('h3 img').attr('src', QHHA.imgDir+eje.name+'.png').end().
					find('h3 big').text(eje.full.label).end();

				ejes.append( eje.template );
			});
		}
	},

	/* SCREEN */
	screen:{ 
		boot:function() {
			QHHA.screen.adjust();
			$(window).resize( QHHA.screen.adjust );
			QHHA.screen.header();
		},
		header:function() { var header = $('#header');
			$(window).scroll(function() {
				if($(document).scrollTop() > 100) {
					header.addClass('easing').addClass('small');
				} else {
					header.addClass('easing').removeClass('small');
				}
			});
		},
		adjust:function() {var w = $(window).width(), h = $(window).height(), hFontSize = 10, wFontSize = 10;
			if(h < 1050) { 
				hFontSize = Math.min(10, Math.max(10*(h/1050),7));
			}
			if(w < 1100) { 
				wFontSize = Math.min(10, Math.max(10*(w/1100),7)); 
			}

			if(w/h < 0.8) {
				$('#zapGdl').addClass('portrait');
				$('#inicio .slide .inside').css('min-height', h);
				$('.logoList').css('font-size', '4px');
			} else {
				$('#zapGdl').removeClass('portrait');
				$('#inicio .slide .inside').css('min-height', 'auto');
				$('.logoList').css('font-size', '5px');
			}
			$('#inicio .wHeight').css('height', h+'px')
			//$('#zapGdl .slide').css('min-height', h+'px')
			$('#zapGdl, #inicio').css('font-size', Math.min( hFontSize, wFontSize )+'px'); 
		}
	},

	/* SHEET */
	sheet: {
		zap:'1xFOEq-kHbPpTp69XOPPOS3xM6h-2hBPNGJLpc49gWLg',
		gdl:'1KgtTvqqNeCZn4mCQEIRFYI3Wr4P2dvQvpub3toLFtoE',
			done: [],
		data: {},
		split:function(str) { 
			var  re = /(\S+): (.*?)(?=$|, \S+:)/g,
				match, cols = {};
			while( match = re.exec(str) ) {
				cols[match[1]] = match[2];
			}
			return cols;
		},
		getEje:function(zapGdl, eje, ejeN) {
			var url = 'https://spreadsheets.google.com/feeds/list/ZAPGDL/EJE/public/basic?alt=json',
				S = QHHA.sheet;
			url = url.replace(/ZAPGDL/, this[zapGdl]).replace(/EJE/, ejeN);

			var compromisos = [];
			$.getJSON(url, function(data){
				if(data && data.feed && data.feed.entry) {
					$.each(data.feed.entry, function(i) {
						compromiso = this.title['$t'];
						if( !compromiso.match(/Row: \d+/) ) {
							compromisos.push( {compromiso:compromiso, indicadores:[]} );
						}
						var indicadores = QHHA.sheet.split( this.content['$t'] );
						compromisos[compromisos.length - 1].indicadores.push( indicadores );
					});
				}

				S.data[eje] = compromisos;
				S.done.push( eje );
				if( TOOLS.isSame( S.done, QHHA.ejes ) ) {
					S.load();
					S.count();
					S.medidor();
				}
			});
		},
		fetch:function(zapGdl) { var S = QHHA.sheet;
			$.each(QHHA.ejes, function(i) { var eje = this;
				S.getEje(zapGdl, eje, i+1);
			})
		},
		medidor:function() {
			$('#ejes .eje li.indicador').each(function() { var indi = $(this);
				var arranque = {html:indi.find('.arranque span')},
					actualizacion = {html:indi.find('.actualización span')},
					meta = {html:indi.find('.meta span')};

				arranque.number = TOOLS.parse( arranque.html.text() );
				meta.number = TOOLS.parse( meta.html.text() );
				actualizacion.number = TOOLS.parse(actualizacion.html.text());

				if( !isNaN(arranque.number) && !isNaN(actualizacion.number) && !isNaN(meta.number) ) {
					var track = {number:meta.number - arranque.number},
					advance = {number:actualizacion.number - arranque.number };
					advance.percent = Math.min(100, Math.ceil(advance.number/track.number*100),100);
              		//actualizacion.html.before('<div class="bar" style="width:'+advance.percent+'%"></div>');
          // esta bien-----------
          /* if(advance.percent <= 0) {
            indi.addClass('nopasaMeta');
          }  */
          // esta bien-----------

          /*  if(actualizacion.number >= meta.number) {
              indi.addClass('pasaMeta');
              if( advance.percent >= meta.number) {
                indi.addClass('pasaMeta');
            }
          }  */

            if(actualizacion.number < 0 || advance.percent < 0) {
            actualizacion.html.before(
              '<div class="bar" style="width:0%"></div>'
            );
          } else {
            actualizacion.html.before(
              '<div class="bar" style="width:' + advance.percent + '%"></div>'
            );
		  } 
		 
		  if(actualizacion.number < 0 || advance.percent < 0) {
			indi.addClass('negativeProgress muyMal');
		  }
			
		   
		   if(advance.percent >= 50) {
            	actualizacion.html.addClass('rightHalf');
				if(advance.percent >= 90) {
					actualizacion.html.addClass('rightDecile');
            } 
            if(advance.percent >= 100 || actualizacion.number >= 100) {
              indi.addClass('');
              
            }else {
				indi.find('.bar').css({marginRight: '-'+(actualizacion.html.outerWidth()+15)+'px'});
				}
			}  
					//if( (meta.number == 4500) ) {
						//console.log(indi, "advance: "+ advance.number, "track: "+  track.number, "arranque: " +arranque.number, "meta: "+ meta.number, "actualizacion: "+actualizacion.numbeu);
					//}
			
			}
				if( arranque.html.text().match(/NO/) ) {
					indi.addClass('evidencia');
					if( actualizacion.html.text().match(/^S/) ) {
						indi.addClass('entregado');
						actualizacion.html.text('✓ ENTREGADO');
					}
				}
			})
		},
		show: function(col, name, link, caption) {
			var out = '&nbsp';
			if(col[name]) {
				out = (caption || '')
				if(link && col[link]) {
					out += '<a href="'+col[link]+'" target="new">'+TOOLS.markdown( col[name] )+'</a>';
				} else {
					if( (name == 'arranque')||(name == 'actualización')||(name == 'meta') ) {
						out += '<span>'+col[name].replace(/\s*[\d.,]+\s*/,'<b>$&</b>')+'</span>';
					} else if( (name == 'fechaarranque')||(name == 'fechaactualización')||(name == 'fechameta') ) {
						out += col[name].replace(/[\d.,]+/,'<b>$&</b>');
					} else {
						out += (caption ? '<em>':'') + TOOLS.markdown( col[name] ) + (caption ? '</em>':'');
					}
				}
			}
			return ('<div class="'+name+'">'+out+'</div>');
		},
		expand:{
			thisOne:function() {
				$(this).parents('li.compromiso').toggleClass('picked');
			},
			all:function() {
				$(this).parents('.eje').find('li.compromiso')[ ($(this).hasClass('ocultar') ? 'remove' : 'add' )+'Class']('picked');
				$(this).toggleClass('ocultar');
			}
		},
		count: function() { var totalCompromisos = 0, totalIndicadores = 0;
			$.each(QHHA.ejes, function() { var eje = {name:this+'', de:{}}, indicadores = 0;
				eje.de.indice = $('#indice .'+eje.name+' small');
				eje.de.ejes = $('.eje.'+eje.name);
				eje.data = QHHA.sheet.data[eje.name];

				$( [eje.de.indice.find('.compromisos'), eje.de.ejes.find('p .compromisos')] ).each(function() {
					$(this).text( eje.data.length );
				});
				totalCompromisos += eje.data.length;

				$.each(eje.data, function(i) { var compromiso = this, l = compromiso.indicadores.length
					indicadores += l;
					eje.de.ejes.find('ol.compromisos li.compromiso:eq('+i+') span.indicadores').text( l );
				});

				$( [eje.de.ejes.find('p a.indicadores span.indicadores'), eje.de.indice.find('.indicadores')] ).each(function() {
					$(this).text( indicadores );
				});
				totalIndicadores += indicadores;
			})
			$('#indice').addClass('counted').find('.bienvenida').
				find('.totalCompromisos').text( totalCompromisos ).end().
				find('.totalIndicadores').text( totalIndicadores );
		},
		load:function() { var compromiso = {template:$('#template .compromiso')},
				indicador = {template:$('#template .indicador')},
				veSusIndicadores = $('#template .veSusIndicadores'),
				data = QHHA.sheet.data,
				show = QHHA.sheet.show;

			$.each(QHHA.ejes, function() { var eje = {name:this+''};
				eje.html = $('.eje.'+eje.name);
				var compromisos = eje.html.find('ol.compromisos');
				eje.html.find('a.indicadores').click( QHHA.sheet.expand.all );

				$.each(data[eje.name], function(i) { compromiso.data = this;
					compromiso.clone = compromiso.template.clone();
					indicador.ol = compromiso.clone.find('ol.indicadores');
					compromiso.clone.find('big').html( TOOLS.markdown( compromiso.data.compromiso )).
						append(veSusIndicadores.clone()).
						after('<img class="icon" src="/img/icons/'+eje.name+'-'+QHHA.zapGdl+'-'+(i+1)+'.png" />');
					
					$.each(compromiso.data.indicadores, function() { indicador.data = this; var indi = this;
						indicador.ol.append(
							indicador.template.clone().html(
								'<div class="li">'+
									show(indi, 'descripción')+
									show(indi, 'arranque')+
									show(indi, 'actualización')+
									show(indi, 'meta')+
								'</div><div class="hover">'+
									show(indi, 'fuente', 'enlacefuente', 'Fuente: ')+
									show(indi, 'observaciones', 'enlaceobservaciones')+
									show(indi, 'fechaarranque')+
									show(indi, 'fechaactualización')+
									show(indi, 'fechameta')+
								'</div>'
							)
						);
					});
					compromisos.append( compromiso.clone );
					compromiso.clone.find('big').click( QHHA.sheet.expand.thisOne );
				});
			});
			$('li.indicador').click(function() {$(this).addClass('clicked')});
		}
	}
};

var TOOLS = {
	isSame:function(array1, array2) { 
		return array1.sort().join() == array2.sort().join()
	},
	markdown:function(str) {
		return str.replace(/_([^_]+?)_/g,'<em>$1</em>').
			replace(/\*([^*]+?)\*/g,'<strong>$1</strong>').
			replace(/\n+/g,'<br />');
	},
	parse:function(str) {
		return parseFloat( str.replace(/#|,|%/g,'').replace(/^\s*(\d+)\s+.*$/,'$1') );
	}
};

$( document ).ready(function() {
	QHHA.boot();
});