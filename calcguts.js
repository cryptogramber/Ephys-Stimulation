$(document).ready(function() {
	var pd_val = "";
	var pdu_val = "";
	var phase_val = "";
	var type_val = "";
	var ipp_val = "";
	var ippu_val = "";
	var tbw_val = "";
	var tbwu_val = "";
	var ptd_val = "";
	var ptdu_val = "";
	var amp_val = "";
	var freq_val = "";
	var np_val = "";
	var nb_val = "";
	var ibi_val = "";
	var ibiu_val = "";
	
	var a1 = [[0,0],[1,0],[1,1],[1.5,1],[1.5,-1],[2,-1],[2,0],[4,0],[4,1],[4.5,1],[4.5,-1],[5,-1],[5,0],[7,0],[7,1],[7.5,1],[7.5,-1],[8,-1],[8,0],[12,0]];
	$.plot("#placeholder", [a1]);
	
	//var o = plot.pointOffset({x: 0.2, y: 0.5});
	//placeholder.append("<div style='position:absolute;left:" + (o.left + 4) + "px;top:" + o.top + "px;color:#666;font-size:smaller'>Warming up</div>");
	//o = plot.pointOffset({x: 1, y: 1.2});
	//placeholder.append("<div style='position:absolute;left:" + (o.left + 4) + "px;top:" + o.top + "px;color:#666;font-size:smaller'>Actual measurements</div>");
	
	type_val = document.getElementById("dt").value;
	$('#freq').attr('disabled','disabled');
	$('#np').attr('disabled','disabled');
	
	$('.choice').change(function() {
		type_val = document.getElementById("dt").value;
		if (type_val === "ipptbw") {
			$('#freq').attr('disabled','disabled');
			$('#np').attr('disabled','disabled');
			$('#ipp').removeAttr('disabled');
			$('#tbw').removeAttr('disabled');
		} else if (type_val === "freqnp") {
			$('#ipp').attr('disabled','disabled');
			$('#tbw').attr('disabled','disabled');
			$('#freq').removeAttr('disabled');
			$('#np').removeAttr('disabled');
		};
	});
	
	$('.target').change(function() {
		pd_val = parseFloat(document.getElementById("pd").value);
		pdu_val = parseFloat(document.getElementById("pdu").value);
		phase_val = parseFloat($('input:radio[name=phase]:checked').val());
		ippu_val = parseFloat(document.getElementById("ippu").value);
		tbwu_val = parseFloat(document.getElementById("tbwu").value);
		ptd_val = parseFloat(document.getElementById("ptd").value);
		ptdu_val = parseFloat(document.getElementById("ptdu").value);
		amp_val = parseFloat(document.getElementById("amp").value);
		nb_val = parseFloat(document.getElementById("nb").value);
		ibi_val = parseFloat(document.getElementById("ibi").value);
		ibiu_val = parseFloat(document.getElementById("ibiu").value);
		neglead_val = document.getElementById("neglead").checked;
		
		ptd_scinotation = ptd_val/ptdu_val;
		pulse_duration = pd_val/pdu_val;
		total_pulse = phase_val*pulse_duration;
		inter_burst_interval = ibi_val/ibiu_val;
		
		$("#ptd_sn").text(ptd_scinotation.toExponential(2));
		$("#pd_sn").text(pulse_duration.toExponential(2));
		$("#ibi_sn").text(inter_burst_interval.toExponential(2));
		
		if (type_val === "ipptbw") {
			ipp_val = parseFloat(document.getElementById("ipp").value);
			tbw_val = parseFloat(document.getElementById("tbw").value);
		
			inter_pulse = ipp_val/ippu_val;
			pulses_with_ipp =  total_pulse+inter_pulse;
			train_burst_width = tbw_val/tbwu_val;
			number_pulses = Math.round(train_burst_width/pulses_with_ipp);
			frequency = (1/pulses_with_ipp).toFixed(2);
		
			$("#ipp_sn").text(inter_pulse.toExponential(2));
			$("#tbw_sn").text(train_burst_width.toExponential(2));
			
			document.getElementById("freq").value = frequency.toString(10);
			document.getElementById("np").value = number_pulses.toString(10);
		} else if (type_val = "freqnp") {
			freq_val = parseFloat(document.getElementById("freq").value);
			np_val = parseFloat(document.getElementById("np").value);
		
			number_pulses = np_val;
			ipp_precalc = ((1-(total_pulse*freq_val))/freq_val);
			tbw_precalc = ((total_pulse+ipp_precalc)*np_val);
			
			inter_pulse = ipp_precalc;
			inter_pulse_format = ipp_precalc*ippu_val;
			train_burst_width = tbw_precalc*tbwu_val;
			
			$("#ipp_sn").text(ipp_precalc.toExponential(2));
			$("#tbw_sn").text(tbw_precalc.toExponential(2));
			
			fr_ipp = inter_pulse_format.toFixed(4);
			fr_tbw = train_burst_width.toFixed(4);
		
			document.getElementById("ipp").value = fr_ipp.toString(10);
			document.getElementById("tbw").value = fr_tbw.toString(10);
		};

		if (phase_val === 1) {
			second_half = 0;
			namp_val = amp_val;
		} else if (phase_val === 2) {
			second_half = pulse_duration;
			namp_val = -(amp_val);	
		};
		
		if (neglead_val === true) {
			amp_val = -(amp_val);
			namp_val = -(namp_val);
		};
		
		var base = ptd_scinotation;
		var burst = [];
		burst.push([0,0]);
		
		for (var outer=0; outer<nb_val; outer++) {
			for (var i=0; i<number_pulses; i++) {
				burst.push([base,0]);
				burst.push([base,amp_val]);
				base = base+pulse_duration;
				burst.push([base,amp_val]);
				burst.push([base,namp_val]);
				base = base+second_half;
				burst.push([base,namp_val]);
				burst.push([base,0]);
				base = base+inter_pulse;
			}; 
			base = base-inter_pulse+inter_burst_interval;
		};
		endline = base+inter_pulse*2;
		burst.push([endline,0]);
		$(function() {
			$.plot("#placeholder", [ burst ]);
		});
	});
});
