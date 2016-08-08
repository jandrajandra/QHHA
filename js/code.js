var QHHA = {
	boot:function() {
		$('.compromisos a.compromiso').click( this.pickCompromiso );
	},
	sheet: {
		zap:'1KgtTvqqNeCZn4mCQEIRFYI3Wr4P2dvQvpub3toLFtoE',
		gdl:'1KgtTvqqNeCZn4mCQEIRFYI3Wr4P2dvQvpub3toLFtoE',
		ejes: {
			seg:1, urb:2, eco:3, efi:4, pub:5, med:6, com:7
		},
		fetch:function(zapGdl, eje) {
			var url = 'https://spreadsheets.google.com/feeds/list/ZAPGDL/EJE/public/basic?alt=json';
			url = url.replace(/ZAPGDL/, this[zapGdl]).replace(/EJE/, this.ejes[eje]);
			console.log(url);

			$.getJSON(url, function(data){
				console.log(data);
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
