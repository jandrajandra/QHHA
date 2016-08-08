var QHHA = {
	boot:function() {
		//$('.compromisos a.compromiso').click( this.pickCompromiso );
	},
	days:{
		since:function() {
			var dias = Math.ceil((new Date() - new Date("2015/September/30"))/(1e3*60*60*24)),
				total = (new Date("2018/September/30") - new Date("2015/September/30"))/(1e3*60*60*24),
				porcentaje = Math.ceil((dias*100)/total);
			$('.alcalde .inicioFin .dias i').text(dias);
			$('.alcalde .inicioFin .porcentaje i').text(porcentaje);
		}
	},
	tools:{
		isSame:function(array1, array2) { 
			return array1.sort().join() == array2.sort().join()
		}
	},
	sheet: {
		zap:'1KgtTvqqNeCZn4mCQEIRFYI3Wr4P2dvQvpub3toLFtoE',
		gdl:'1KgtTvqqNeCZn4mCQEIRFYI3Wr4P2dvQvpub3toLFtoE',
		ejes: [ 'seg', 'urb', 'eco', 'efi', 'pub', 'med', 'com' ],
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
				if( QHHA.tools.isSame( S.done, S.ejes ) ) {
					S.load();
				}
			});
		},
		fetch:function(zapGdl) { var S = QHHA.sheet;
			$.each(S.ejes, function(i) { var eje = this;
				S.getEje(zapGdl, eje, i+1);
			})
		},
		load:function() { var teCompromiso = $('#template .compromiso'),
				teIndicador = $('#template .indicador'),
				data = QHHA.sheet.data,
				prop = function(obj, name) {
					if(obj[name]) {
						return '<div class="'+name+'">'+obj[name]+'</div>';
					} else {
						return '';
					}
				};

			$.each(QHHA.sheet.ejes, function() { var eje = this,
					compromisos = $('.eje.'+eje+' .compromisos');

				$.each(data[eje], function() { var daCompromiso = this,
						elCompromiso = teCompromiso.clone(),
						elIndicadores = elCompromiso.find('ul.indicadores');

					elCompromiso.find('big').html( daCompromiso.compromiso );
					$.each(daCompromiso.indicadores, function() { var daIndicador = this;
						elIndicadores.append(
							teIndicador.clone().html(
								prop(daIndicador, 'descripción')+
								prop(daIndicador, 'observaciones')+
								prop(daIndicador, 'meta2018')+
								prop(daIndicador, 'actualización2016')+
								prop(daIndicador, 'arranque2015')
							)
						);
					});
					elCompromiso.appendTo( compromisos );
					elCompromiso.find('big').click( QHHA.pickCompromiso);
				});
			});
		}
	},
	pickCompromiso:function() {
		$(this).parents('ul.compromisos').toggleClass('picked');
	}
};

$( document ).ready(function() {
	QHHA.boot();
});
