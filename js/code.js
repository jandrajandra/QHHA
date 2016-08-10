var QHHA = {
	boot:function() {
		$('#indice #alcalde').css('margin-bottom', 0);
		QHHA.build.boot();
		QHHA.screen.boot();
	},
	ejes: [ 'seg', 'urb', 'eco', 'efi', 'pub', 'med', 'com' ],
	imgDir: '/img/icons/',
	ejesFull: {
		seg:{label:'Seguridad y prevención del delito', shortLabel:'Seguridad', id:'seguridad'},
		urb:{label:'Desarrollo Urbano', id:'desarrollo-urbano'},
		eco:{label:'Desarrollo Económico', id:'desarrollo-economico'},
		efi:{label:'Eficiencia Administrativa', id:'eficiencia'},
		pub:{label:'Servicios Públicos', id:'servicios-publicos'},
		med:{label:'Medio Ambiente', id:'medio-ambiente'},
		com:{label:'Construcción de Comunidad', id:'comunidad'},
	},
	build:{
		boot:function() {
			this.indice();
			this.ejes();
		},
		indice:function() { var indice = $('#indice ul.indice');
			$.each(QHHA.ejes, function(i) { var eje = {name:this+''},
					indizado = $('#template .indizado').clone();
				eje.full = QHHA.ejesFull[ eje.name ];

				indizado.addClass( eje.name + ( ((i%2 == 0) && (i != 6)) ? ' right' : '')).
					find('img').attr('src', QHHA.imgDir+eje.name+'.png').end().
					find('big a').attr('href', '#'+eje.full.id).text(eje.full.shortLabel || eje.full.label);
				indice.append( indizado );
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
	screen:{ 
		boot:function() {
			QHHA.screen.adjust();
			$(window).resize( QHHA.screen.adjust );
			QHHA.screen.header();
		},
		header:function() { var header = $('#header');
			$(window).scroll(function() {
				if($(document).scrollTop() > 100) {
					header.addClass('small');
				} else {
					header.removeClass('small');
				}
			});
		},
		adjust:function() {var w = $(window).width(), h = $(window).height();
			$('#guadalajara #indice').css('height', h);
			$('#indice #alcalde').css('left', (w-parseFloat($('#indice #alcalde').css('width')))/2 );
		}
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

	/* SHEET */
	sheet: {
		zap:'1KgtTvqqNeCZn4mCQEIRFYI3Wr4P2dvQvpub3toLFtoE',
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
					S.count();
					S.load();
				}
			});
		},
		fetch:function(zapGdl) { var S = QHHA.sheet;
			$.each(QHHA.ejes, function(i) { var eje = this;
				S.getEje(zapGdl, eje, i+1);
			})
		},
		prop: function(col, name, link, caption) {
			var out = '&nbsp';
			if(col[name]) {
				if(link && col[link]) {
					out = (caption || '') +
						'<a href="'+col[link]+'" target="new">'+TOOLS.markdown( col[name] )+'</a>';
				} else {
					out = TOOLS.markdown( col[name] );
				}
			}
			return ('<div class="'+name+'">'+out+'</div>');
		},
		expand:{
			thisOne:function() {
				$(this).parents('li.compromiso').find('ol.indicadores').toggleClass('picked');
			},
			all:function() {
				QHHA.test = $(this).parents('.eje').find('ol.compromisos');
				console.log('double!?');
				
				$(this).parents('.eje').find('ol.compromisos').toggleClass('picked').
					find('ol.indicadores').removeClass('picked');
			}
		},
		count: function() { var totalCompromisos = 0, totalIndicadores = 0;
			$.each(QHHA.ejes, function() { var eje = {name:this+'', de:{}}, indicadores = 0;
				eje.de.indice = $('#indice .'+eje.name+' small');
				eje.de.ejes = $('.eje.'+eje.name+' p');
				eje.data = QHHA.sheet.data[eje.name];

				$( [eje.de.indice.find('.compromisos'), eje.de.ejes.find('.compromisos')] ).each(function() {
					$(this).text( eje.data.length );
				});
				totalCompromisos += eje.data.length;

				$.each(eje.data, function() { var compromiso = this;
					indicadores += compromiso.indicadores.length;
				});

				$( [eje.de.ejes.find('a.indicadores span.indicadores'), eje.de.indice.find('.indicadores')] ).each(function() {
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
				data = QHHA.sheet.data,
				prop = QHHA.sheet.prop;

			$.each(QHHA.ejes, function() { var eje = {name:this+''};
				eje.html = $('.eje.'+eje.name);
				var compromisos = eje.html.find('ol.compromisos');
				eje.html.find('a.indicadores').click( QHHA.sheet.expand.all );

				$.each(data[eje.name], function() { compromiso.data = this;
					compromiso.clone = compromiso.template.clone();
					indicador.ol = compromiso.clone.find('ol.indicadores');
					compromiso.clone.find('big').html( TOOLS.markdown( compromiso.data.compromiso ));

					$.each(compromiso.data.indicadores, function() { indicador.data = this; var indi = this;
						indicador.ol.append(
							indicador.template.clone().html(
								prop(indi, 'descripción')+
								prop(indi, 'arranque')+
								prop(indi, 'actualización')+
								prop(indi, 'meta')+
								'<div class="hover">'+
									prop(indi, 'fuente', 'enlacefuente', 'Fuente: ')+
									prop(indi, 'observaciones')+
									prop(indi, 'fechaarranque')+
									prop(indi, 'fechaactualización')+
									prop(indi, 'fechameta')+
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
	}
};

$( document ).ready(function() {
	QHHA.boot();
});
