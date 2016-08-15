var QHHA = {
	boot:function() {
		$('#header .top, #menu a:first').click( QHHA.toTop );
		QHHA.zapGdl = $('body').data('zapgdl');

		QHHA.build.boot();
		QHHA.screen.boot();
		QHHA.dockZoom.boot();

		QHHA.scroll = ScrollReveal();
		QHHA.scroll.reveal('.flor .icon', {
			reset:true, delay:500
		});
		QHHA.scroll.reveal('.flor span.seg, .flor span.urb, .flor span.com', {
			reset:true, delay:1000, duration:1000, scale:0.6, origin:'left'
		});
		QHHA.scroll.reveal('.flor span.eco, .flor span.efi, .flor span.pub, .flor span.med', {
			reset:true, delay:1000, duration:1000, scale:0.6, origin:'right'
		});

		QHHA.slide.boot();
	},
	scroll:false,
	slide:{
		boot:function() {
			QHHA.scroll.reveal('.slide', {
				reset:true,
				duration:800,
				scale:0.6,
				viewFactor:0.5,
				beforeReveal:QHHA.slide.transition
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
	toTop:function() {
		event.preventDefault();
		$('html, body').stop().animate({
			scrollTop: 0
		}, 1000);
		history.pushState('', document.title, window.location.pathname);
		return void(0);
	},
	ejes: [ 'seg', 'urb', 'eco', 'efi', 'pub', 'med', 'com' ],
	imgDir: '/img/icons/',
	zapGdl:'gdl',

	ejesFull: {
		seg:{label:'Seguridad y Prevención del Delito', shortLabel:'Seguridad', id:'seguridad', color:'#AF0B1E'},
		urb:{label:'Desarrollo Urbano', id:'desarrollo-urbano', color:'#CDDA1B'},
		eco:{label:'Desarrollo Económico', id:'desarrollo-economico', color:'#F6921F'},
		efi:{label:'Eficiencia Administrativa', id:'eficiencia', color:'#8583A0'},
		pub:{label:'Servicios Públicos', id:'servicios-publicos', color:'#E50027'},
		med:{label:'Medio Ambiente', id:'medio-ambiente', color:'#FBBF0E'},
		com:{label:'Construcción de Comunidad', id:'comunidad', color:'#253763'},
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

	dockZoom: {
		boot:function() {
			$('.sponsors a, #inicio .logos a').hover( QHHA.dockZoom.over, QHHA.dockZoom.out );
		},
		over:function() {
			QHHA.dockZoom.out.apply(this);
			$(this).addClass('zoomed').prev().addClass('zoomedAdj').next().next().addClass('zoomedAdj');
		},
		out:function() {
			$(this).add($(this).siblings()).removeClass('zoomed zoomedAdj');
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
				indice.append( '<br  '+(((i+1)%2 == 0) ? '' : 'class="soloEnMovil"')+' />' );
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
		stopEasing:function() {
			setTimeout(function() {$('#header').removeClass('easing')}, 1200);
		},
		adjust:function() {var w = $(window).width(), h = $(window).height(), hFontSize = 10, wFontSize = 10;
			if(h < 1050) { 
				hFontSize = Math.min(10, Math.max(10*(h/1050),7));
			}
			if(w < 1100) { 
				wFontSize = Math.min(10, Math.max(10*(w/1100),7)); 
			}

			if(w/h < 0.8) {
				$('#zapGdl').addClass('movil');
			} else {
				$('#zapGdl').removeClass('movil');
			}
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
					S.gauge();
				}
			});
		},
		fetch:function(zapGdl) { var S = QHHA.sheet;
			$.each(QHHA.ejes, function(i) { var eje = this;
				S.getEje(zapGdl, eje, i+1);
			})
		},
		gauge:function() {
			$('#ejes .eje li.indicador').each(function() { var indi = $(this);
				var arranque = {html:indi.find('.arranque span')},
					actualizacion = {html:indi.find('.actualización span')},
					meta = {html:indi.find('.meta span')};

				arranque.number = TOOLS.parse( arranque.html.text() );
				meta.number = TOOLS.parse( meta.html.text() );
				actualizacion.number = TOOLS.parse(indi.find('.actualización span').text());

				if( !isNaN(arranque.number) && !isNaN(actualizacion.number) && !isNaN(meta.number) ) {
					var track = {number:meta.number - arranque.number, pixels:indi.find('.actualización').width() },
						advance = {number:actualizacion.number - arranque.number };
					advance.pixels = Math.abs(advance.number/track.number) * track.pixels;
					actualizacion.html.before('<div class="bar" style="width:'+advance.pixels+'px"></div>');
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
									show(indi, 'observaciones')+
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
		return parseFloat( str.replace(/#/,'') );
	}
};

$( document ).ready(function() {
	QHHA.boot();
});
