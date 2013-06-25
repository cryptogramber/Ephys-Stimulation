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
	
	var a1 = [[0,0],[1,0]];
	var a2 = [[1,0],[1,1],null,[1.5,1],[1.5,-1],null,[2,-1],[2,0],null,[4,0],[4,1],null,[4.5,1],[4.5,-1],null,[5,-1],[5,0],null,[7,0],[7,1],null,[7.5,1],[7.5,-1],null,[8,-1],[8,0]];
	var a3 = [[1,1],[1.5,1],null,[1.5,-1],[2,-1],null,[4,1],[4.5,1],null,[4.5,-1],[5,-1],null,[7,1],[7.5,1],null,[7.5,-1],[8,-1]];
	var a4 = [[2,0],[4,0],null,[5,0],[7,0]];
	var a5 = [[8,0],[12,0]];
	var a6 = [];
	$.plot("#placeholder", [a5, a1, a3, a4, a2]);
	
	var o = plot.pointOffset({x: 0.2, y: 0.5});
	placeholder.append("<div style='position:absolute;left:" + (o.left + 4) + "px;top:" + o.top + "px;color:#666;font-size:smaller'>Warming up</div>");
	o = plot.pointOffset({x: 1, y: 1.2});
	placeholder.append("<div style='position:absolute;left:" + (o.left + 4) + "px;top:" + o.top + "px;color:#666;font-size:smaller'>Actual measurements</div>");
	
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
		ptd_scinotation = ptd_val/ptdu_val;
		pulse_duration = pd_val/pdu_val;
		total_pulse = phase_val*pulse_duration;
		$("#ptd_sn").text(ptd_scinotation.toExponential(2));
		$("#pd_sn").text(pulse_duration.toExponential(2));
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
		
			ipp_precalc = ((1-(total_pulse*freq_val))/freq_val);
			tbw_precalc = ((total_pulse+ipp_precalc)*np_val);
			
			inter_pulse = ipp_precalc*ippu_val;
			train_burst_width = tbw_precalc*tbwu_val;
			
			$("#ipp_sn").text(ipp_precalc.toExponential(2));
			$("#tbw_sn").text(tbw_precalc.toExponential(2));
			
			fr_ipp = inter_pulse.toFixed(4);
			fr_tbw = train_burst_width.toFixed(4);
		
			document.getElementById("ipp").value = fr_ipp.toString(10);
			document.getElementById("tbw").value = fr_tbw.toString(10);
		};

		step1 = ptd_scinotation + pulse_duration;
		step2 = ptd_scinotation + total_pulse;
		step3 = ptd_scinotation + total_pulse + inter_pulse;
		step4 = ptd_scinotation + total_pulse + inter_pulse + pulse_duration;
		step5 = ptd_scinotation + total_pulse + inter_pulse + total_pulse;
		step6 = ptd_scinotation + total_pulse + inter_pulse + total_pulse + inter_pulse;
		step7 = ptd_scinotation + total_pulse + inter_pulse + total_pulse + inter_pulse + pulse_duration;
		step8 = ptd_scinotation + total_pulse + inter_pulse + total_pulse + inter_pulse + total_pulse;
		step9 = ptd_scinotation + total_pulse + inter_pulse + total_pulse + inter_pulse + total_pulse + inter_pulse;
		namp_val = -(amp_val);
		
		$(function() {
			if (phase_val === 2) {
				var d2 = [[0, 0], [ptd_scinotation, 0], [ptd_scinotation, amp_val], [step1, amp_val], [step1, namp_val], [step2, namp_val], [step2, 0], [step3, 0], [step3, amp_val], [step4, amp_val], [step4, namp_val], [step5, namp_val], [step5, 0], [step6, 0], [step6, amp_val], [step7, amp_val], [step7, namp_val], [step8, namp_val], [step8, 0], [step9, 0]];
				$.plot("#placeholder", [ d2 ]);
			} else if (phase_val === 1) {
				var d2 = [[0, 0], [ptd_scinotation, 0], [ptd_scinotation, amp_val], [step1, amp_val], [step1, 0], [(step1+inter_pulse), 0], [(step1+inter_pulse), amp_val], [(step1+inter_pulse+pulse_duration), amp_val], [(step1+inter_pulse+pulse_duration), 0]];
				$.plot("#placeholder", [ d2 ]);
			}; 
		});
	});
});
