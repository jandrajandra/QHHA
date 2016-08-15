var QHHA = {
	boot:function() {
		$('#indice #alcalde').css('margin-bottom', 0);
		$('#header .top').click( QHHA.toTop );
		QHHA.zapGdl = $('body').data('zapgdl');

		QHHA.build.boot();
		QHHA.screen.boot();
		QHHA.dockZoom.boot();
		QHHA.slide.boot();
	},
	slide:{
		boot:function() {
			QHHA.slide.color();
		},
		color:function() {
			var wHeight = $(window).height();

			$('.slide')
				.height(wHeight)
				.scrollie({
					scrollOffset : -300,
					scrollingInView : function(slide) {
						 var bgColor = slide.data('background');
						 
						 $('body').css('background-color', bgColor);
					}
				});
		}
	},
	toTop:function() {
		$(window).scrollTop(0);
		history.pushState('', document.title, window.location.pathname);
	},
	ejes: [ 'seg', 'urb', 'eco', 'efi', 'pub', 'med', 'com' ],
	imgDir: '/img/icons/',
	zapGdl:'gdl',
	ejesFull: {
		seg:{label:'Seguridad y Prevención del Delito', shortLabel:'Seguridad', id:'seguridad'},
		urb:{label:'Desarrollo Urbano', id:'desarrollo-urbano'},
		eco:{label:'Desarrollo Económico', id:'desarrollo-economico'},
		efi:{label:'Eficiencia Administrativa', id:'eficiencia'},
		pub:{label:'Servicios Públicos', id:'servicios-publicos'},
		med:{label:'Medio Ambiente', id:'medio-ambiente'},
		com:{label:'Construcción de Comunidad', id:'comunidad'},
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

				eje.template.addClass( eje.name ).attr('id', eje.full.id).
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
			$('#zapGdl').css('font-size', Math.min( hFontSize, wFontSize )+'px'); 
			$('#zapGdl #indice').css('height', h);

			var alcaldeWidth = parseFloat($('#indice #alcalde').css('width'));
			$('#indice #alcalde').css('left', (w-alcaldeWidth)/2 );
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
			$('#ejes .eje li.indicador').each(function() { 
				var arranque = TOOLS.parse($(this).find('.arranque span').text()),
					actualizacion = {html:$(this).find('.actualización span')},
					meta = TOOLS.parse($(this).find('.meta span').text());
				actualizacion.data = TOOLS.parse($(this).find('.actualización span').text());

				if( !isNaN(arranque) && !isNaN(actualizacion.data) && !isNaN(meta) ) {
					var track = {data:meta - arranque, screen:$(this).find('.actualización').width() },
						advance = {data:actualizacion.data - arranque };
					advance.screen = Math.abs(advance.data/track.data) * track.screen;
					actualizacion.html.before('<div class="bar" style="width:'+advance.screen+'px"></div>');
					//console.log( arranque, meta, actualizacion.data, advance.data, track.data, advance.screen)
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
