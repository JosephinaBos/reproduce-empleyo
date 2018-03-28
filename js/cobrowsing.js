$(document).ready(function () {
    var urlClient;
    var urlAgent;

    function is_valid_url(url) {
        return /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/.test(url);
    }

    function copyToClipboard(elem) {
        var targetId = "_hiddenCopyText_";
        var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
        var origSelectionStart, origSelectionEnd;
        
        if (isInput) {
            target = elem;
            origSelectionStart = elem.selectionStart;
            origSelectionEnd = elem.selectionEnd;
        } else {
            target = document.getElementById(targetId);
            if (!target) {
                var target = document.createElement("textarea");
                target.style.position = "absolute";
                target.style.left = "-9999px";
                target.style.top = "0";
                target.id = targetId;
                document.body.appendChild(target);
            }
            target.textContent = elem.textContent;
        }

        var currentFocus = document.activeElement;
        target.focus();
        target.setSelectionRange(0, target.value.length);
        var succeed;
        
        try {
            succeed = document.execCommand("copy");
        } catch (e) {
            succeed = false;
        }

        if (currentFocus && typeof currentFocus.focus === "function") {
            currentFocus.focus();
        }
        if (isInput) {
            elem.setSelectionRange(origSelectionStart, origSelectionEnd);
        } else {
            target.textContent = "";
        }

        return succeed;
    }

    $("#process").click(function () {
        if ($('#urlToProcess').val() != '') {
            if (is_valid_url($('#urlToProcess').val())) {
                var request = new XMLHttpRequest();
                request.open('POST', 'https://surfly.com/v2/sessions/?api_key=ce165b93307b4b1eb141aa5b3c99066f');
                request.setRequestHeader('Content-Type', 'application/json');

                var body = {
                    'url': $('#urlToProcess').val(),
                    'format_session_id': false,
                    'headers': [],
                    'agent_id': 66122,
		            'hidden' : true,
                    'white_label': true,
                    'docked_only': true,
		            'splash': false,
		            'sharing_button': false,
		            'newurl': false,
		            'agent_can_take_control': false,
		            'agent_can_request_control': false,
		            'agent_can_end_session': false
                };

                request.send(JSON.stringify(body));

                request.onreadystatechange = function () {
                    if (this.readyState === 4) {
                        console.log('Status:', this.status);
                        console.log('Headers:', this.getAllResponseHeaders());
                        console.log('Body:', this.responseText);

                        data = JSON.parse(this.responseText);
                        urlClient = data.leader_link;
                        urlAgent = data.viewer_link;

                        var parametros = {
                            "url": $('#urlToProcess').val(),
                            "urlClient": urlClient,
                            "urlAgent": urlAgent
                        };

                        var response;
                        response = urlClient.split('/');
                        response = response[3];
                        var aux = window.location.origin;
                        var nuevaURL = aux + "/support/go/profile.html?id=" + response;
                        $('#urlToClientProd').val(nuevaURL);
                        $('#copy').prop('disabled', false);
                        $('#copy').addClass('btn-success');
                        $('#process').removeClass('btn-success');
                        $('#process').prop('disabled', true);
                        $('#urlToProcess').prop('disabled', true);
                    }
                };
            } else {
                $("#myModalInvalid").modal('show');
            }
        } else {
            $("#myModalEmpty").modal('show');
        }
    });

    $("#copy").click(function () {
        console.log($("#urlToClientProd").val());
        var urlSaved = $("#urlToClientProd").val();

        $("#urlToClientProd").val("Estimado cliente, recuerde que para continuar con su conversación debe minimizar su navegador, la URL a cual ingresar es " + $("#urlToClientProd").val());
        copyToClipboard(document.getElementById("urlToClientProd"));
        
        $('#texto-copiado').text($("#urlToClientProd").val());
        $("#urlToClientProd").val(urlSaved);
        $("#myModal").modal('show');
        $('#init').prop('disabled', false);
        $('#init').addClass('btn-success');
        $('#copy').removeClass('btn-success');
        $('#copy').prop('disabled', true);
    });

    $("#init").click(function () {
        $('#dummy').append('<iframe src="' + urlAgent + '"></iframe>');

        $("#alerta-reinicio").append('<div class="alert alert-info"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>¡Atención!</strong> Para una nueva sesión debes actualizar la página.</div>');
        $('#init').removeClass('btn-success');
        $('#init').prop('disabled', true);
    });

/*
    $("#init").click(function () {
        $("#alerta-reinicio").append('<div class="alert alert-info"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Â¡AteniÃ³n!</strong> Para una nueva sesiÃ³n debes actualizar la pÃ¡gina.</div>');
        $('#init').removeClass('btn-success');
        $('#init').prop('disabled', true);
    });*/
});