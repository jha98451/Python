import React, { Component, useState, useEffect } from "react";
// import ReactTooltip from 'react-tooltip';
import * as ReactDOM from "react-dom";
import './myexternalStyle.css';
import './stramstyle.css';
import './custom.css';
import axios from 'axios';
import Modal from "react-bootstrap/Modal";
import PropTypes from 'prop-types';
// import MypopupForm from "./myPopupform";
// import Popup from 'reactjs-popup';
import $ from "jquery";
import {

    Label,
    Hint,
    Error,
} from "@progress/kendo-react-labels";

//   import { Popup } from "@progress/kendo-react-popup";
const { Input } = require('@progress/kendo-react-inputs');
const { Button } = require('@progress/kendo-react-buttons');
const cloudType = [
    "AZURE"
];
export default class Stramdata extends Component {

    constructor() {
        super();
        this.state = {
            items: [],
            schemaVal: [],
            DataisLoaded: false,
            postId: "Azure",
            myServiceDatatype: false,
            mySchemaData: undefined,
            show: false
        };
        this.handleChange = this.handleChange.bind(this);
    }
    showModal = e => {
        this.setState({
            show: true
        });
    };
    onClose = e => {
        this.setState({
            show: false
        });
    };
    // onClose = e => {
    //     show: false
    // };

    handleChange(e) {
        this.setState({ items: e.target.value });
    }

    addMyHidden() {
        var element3 = document.getElementById("deviceCount");
        element3.classList.add("myhideen");
        var element4 = document.getElementById("selectedSchemahidden");
        element4.classList.add("myhideen");
    }


    removeMyHidden() {
        $('input:checkbox[name=simulation_type]:checked').each(function () {
            alert($(this).val());
        });
        var element1 = document.getElementById("deviceCount");
        element1.classList.remove("myhideen");
        var element2 = document.getElementById("selectedSchemahidden");
        element2.classList.remove("myhideen");
    }

    removeDataOptionsHidden() {

        var element = document.getElementById("DataOption");
        element.classList.remove("myhideen");
        $('#telemetry').not(this).prop('checked', false);
    }
    addeDataOptionsHidden() {

        var element = document.getElementById("DataOption");
        element.classList.add("myhideen");
        $('#anomaly').not(this).prop('checked', false);


    }



    render() {
        if (this.props.show) {
            return null;
        }

        const { DataisLoaded, items } = this.state;

        // clean the code and use to react
        function myVal() {
            var element = document.getElementById("DataOption");
            $('input:radio[name=simulation_type]:checked').each(function () {
                if (($(this).val()) === "Deep_Learning") {
                    element.addClass("myhideen");
                    $('#anomaly').not(this).prop('checked', false);
                } else {
                    // element.removeClass("myhideen");
                    $('#telemetry').not(this).prop('checked', false);
                }

            });


        }
        myVal()
        function get_simulator_details() {
            $.get("/get_simulator_details", function (response) {


                var jsonParsedArray = JSON.parse(response);
                componentDidMount(jsonParsedArray["cloud_type"]);
                clodsrvicedetailsData(
                    jsonParsedArray["cloud_type"],
                    jsonParsedArray["cloud_service_type"]
                );
                clodhubsData(
                    jsonParsedArray["cloud_service_type"],
                    jsonParsedArray["hub_name"]
                );
                //dropdown_hubname(jsonParsedArray['simulator_type'],jsonParsedArray['hub_name'])

                document.getElementById(jsonParsedArray["simulation_type"]).checked = true;
                if (jsonParsedArray["simulation_type"] === "Deep_Learning") {
                    document.getElementById("device_count").disabled = true;
                    $("#rulebased_input").hide();
                } else {
                    document.getElementById("device_count").disabled = false;
                    $("#rulebased_input").show();
                }

                var arr_data_options = jsonParsedArray["data_options"].split(",");
                for (var i = 0, n = arr_data_options.length; i < n; i++) {
                    document.getElementById(arr_data_options[i]).checked = true;
                    if (arr_data_options[i] === "anomaly") {
                        $("#hide").show();
                    }
                }
                document.getElementById("device_count").value =
                    jsonParsedArray["device_count"];
                document.getElementById("time_delay").value = jsonParsedArray["time_delay"];

                if (jsonParsedArray["simulator_status"] === "Active") {
                    $("#btn_sim_start").attr("disabled", "disabled");
                    document.getElementById("btn_sim_start").style.backgroundColor = "Silver";
                    $("#btn_sim_stop").removeAttr("disabled");
                    document.getElementById("btn_sim_stop").style.backgroundColor = "#17A2B8";
                } else {
                    $("#btn_sim_stop").attr("disabled", "disabled");
                    document.getElementById("btn_sim_stop").style.backgroundColor = "Silver";
                    $("#btn_sim_start").removeAttr("disabled");
                    document.getElementById("btn_sim_start").style.backgroundColor =
                        "#17A2B8";
                }
            });
        }
        get_simulator_details()
        function componentDidMount() {
            $("#cloud_type option").remove();
            $("#cloud_type").prepend($("<option></option>").html("Loading..."));
            var sel_cloud_type = ""
            $.ajax({
                type: "POST",
                url: "/get_cloudtype_details",
                dataType: "json",
                data: { req_data: "" },
                success: function (data, textStatus) {
                    $("#cloud_type option").remove();
                    $("#cloud_type").prepend(
                        $("<option></option>").html("Select Cloud Type")
                    );
                    for (var i = 0; i < data.length; i++) {
                        var opt = new Option(data[i]);
                        $("#cloud_type").append(opt);
                        if (sel_cloud_type !== "") {
                            $("#cloud_type").val(sel_cloud_type);
                        } else {
                            $("#cloud_type").val(data[1]);
                        }
                    }
                },
                error: function (xhr, status, e) { },
            });

        }
        componentDidMount()
        function clodsrvicedetails() {
            clodsrvicedetailsData($("#cloud_type").val(), "")


        }

        function clodsrvicedetailsData(cloud_type, sel_cloud_service_type) {
            $("#cloud_service_type option").remove();
            $("#cloud_service_type").prepend($("<option></option>").html("Loading..."));
            var form_data = new FormData();
            form_data = {};
            form_data.cloud_type = cloud_type;
            if (typeof cloud_type !== "undefined") {
                $.ajax({
                    type: "POST",
                    url: "/get_cloudservicetype_details",
                    dataType: "json",
                    data: { req_data: JSON.stringify(form_data) },
                    success: function (data, textStatus) {
                        $("#cloud_service_type option").remove();
                        $("#cloud_service_type").prepend(
                            $("<option></option>").html("Select Cloud Service")
                        );
                        for (var i = 0; i < data.length; i++) {
                            var opt = new Option(data[i]);
                            $("#cloud_service_type").append(opt);
                            if (sel_cloud_service_type != "") {
                                $("#cloud_service_type").val(sel_cloud_service_type);
                            }
                        }
                    },
                    error: function (xhr, status, e) { },
                });
            }
        }
        function clodhubails() {
            clodhubsData($("#cloud_service_type").val(), "")


        }

        function clodhubsData(cloud_service_type, sel_hub_name) {

            $("#hub_names  option").remove();
            // $("#hub_names").prepend($("<option></option>").html("Loading..."));
            var form_data = new FormData();
            form_data = {};

            form_data.cloud_service_type = cloud_service_type;
            if (typeof cloud_service_type !== "undefined") {

                $.ajax({
                    type: "POST",
                    url: "/get_hub_name_details",
                    dataType: "json",
                    data: { req_data: JSON.stringify(form_data) },
                    success: function (data, textStatus) {
                        $("#hub_names option").remove();
                        for (var i = 0; i < data.length; i++) {
                            var opt = new Option(data[i]);
                            $("#hub_names").append(opt);
                            // if (sel_hub_name !== "") {
                            //     $("#hub_names").val(sel_hub_name);
                            //     alert("Jha")
                            // }
                        }
                    },
                    error: function (xhr, status, e) { },
                });
            }
        }


        function start_simulator() {
            alert("Dugu")
            //$this.button('loading');
            var simulation_type = $("input:radio[name='simulation_type']:checked").val();
            console.log(simulation_type);

            var cloud_type = $("#cloud_type").val();
            var cloud_service_type = $("#cloud_service_type").val();
            //var data_options = $("input:checkbox[name='data_options']:checked").val();
            var data_options = document.getElementsByName("data_options");
            var sel_data_options = "";
            for (var i = 0, n = data_options.length; i < n; i++) {
                if (data_options[i].checked) {
                    sel_data_options += "," + data_options[i].value;
                }
            }
            if (sel_data_options) sel_data_options = sel_data_options.substring(1);
            var attributes = document.getElementById("attributes").value;
            var noise = document.getElementById("noise").value;
            var hub_name = $("#hub_names option").val();
            var device_count = document.getElementById("device_count").value;
            var time_delay = document.getElementById("time_delay").value;

            if (
                simulation_type == "" ||
                simulation_type == null ||
                simulation_type == undefined
            ) {
                alert("Please select Simulation Type");
            } else if (
                cloud_type == "" ||
                cloud_type == null ||
                cloud_type == undefined
            ) {
                alert("Please select Cloud Type");
            } else if (cloud_type == "Select Cloud Type") {
                alert("Please select Cloud Type");
            } else if (cloud_type == "Loading...") {
                alert("Please select Cloud Type. Once Loading Done.");
            } else if (
                cloud_service_type == "" ||
                cloud_service_type == null ||
                cloud_service_type == undefined
            ) {
                alert("Please select Cloud Service Type");
            } else if (cloud_service_type == "Select Cloud Service") {
                alert("Please select Cloud Service Type");
            } else if (cloud_service_type == "Loading...") {
                alert("Please select Cloud Service Type. Once Loading Done.");
            } else if (
                sel_data_options == "" ||
                sel_data_options == null ||
                sel_data_options == undefined
            ) {
                alert("Please select Data Options");
            } else if (sel_data_options.includes("anomaly") && attributes == "") {
                alert("Please Enter Attributes.");
            } else if (sel_data_options.includes("anomaly") && noise == "") {
                alert("Please Enter Noise.");
            } else if (hub_name == "" || hub_name == null || hub_name == undefined) {
                alert("Please select Hub Name");
            } else if (hub_name == "Loading...") {
                alert("Please select Hub Name. Once Loading Done.");
            } else if (device_count == "") {
                alert("Please Enter Device Count.");
            } else if (device_count == 0) {
                alert("Please Enter Device Count more than '0'.");
            } else if (time_delay == "") {
                alert("Please Enter Time Delay.");
            } else if (time_delay == 0) {
                alert("Please Enter Time Delay more than '0'.");
            } else {


                fetch('http://localhost:7000/get_device_count', {
                    mode: 'no-cors'
                })
                    .then(function (response) {
                        if (parseInt(device_count) > parseInt(response)) {
                            alert(
                                "Maximum device count is " +
                                response +
                                ". Please enter below than " +
                                response +
                                "."
                            );
                        } else {
                            var form_data = new FormData();
                            form_data = {};

                            form_data.simulation_type = simulation_type;
                            form_data.cloud_type = cloud_type;
                            form_data.cloud_service_type = cloud_service_type;
                            form_data.data_options = sel_data_options;
                            form_data.hub_name = hub_name;
                            form_data.attributes = attributes;
                            form_data.noise = noise;
                            form_data.device_count = device_count;
                            form_data.time_delay = time_delay;
                            form_data.simulator_status = "Active";

                            alert("Simulator Started Successfully");
                            $("#btn_sim_start").attr("disabled", "disabled");
                            document.getElementById("btn_sim_start").style.backgroundColor =
                                "Silver";
                            $("#btn_sim_stop").removeAttr("disabled");
                            document.getElementById("btn_sim_stop").style.backgroundColor =
                                "#17A2B8";

                            $.ajax({
                                type: "POST",
                                url: "/start_simulator",
                                dataType: "json",
                                data: { req_data: JSON.stringify(form_data) },
                                success: function (data, textStatus) {
                                    // get_simulator_details();
                                },
                                error: function (xhr, status, e) { },
                            });
                        }
                    })

            }
        }

        function stop_simulator() {
            var form_data = new FormData();
            form_data = {};

            form_data.simulator_status = "Idle";
            $.ajax({
                type: "POST",
                url: "/stop_simulator",
                dataType: "json",
                data: { req_data: JSON.stringify(form_data) },
                success: function (data, textStatus) {
                    alert("Simulator Stopped Successfully");
                    get_simulator_details()
                },
                error: function (xhr, status, e) { },
            });
        }
        var show = false
        function get_schema() {

            fetch("/get_setting_details")
                .then((response) => response.json()).then((data) => {

                    var f = JSON.parse(data);
                    $('#selected_schema').val(f.msg_template);


                })

        }
        get_schema();
        function schema_view_on_modal() {
            show = true;
            fetch("/get_id_and_name")
                .then((response) => response.json())
                .then((data) => {

                    var req_data = data.template_list_with_id;
                    var schema_name = document.getElementById("selected_schema").value;
                    var templateId = req_data[schema_name];
                    var data = {
                        templateId: templateId,
                    };
                    $.ajax({
                        type: "GET",
                        url: "/get_schema_detail",
                        data: data,
                    }).then(function (response) {
                        data = JSON.parse(response.template_models);
                        bind_schema_table(data);
                    });
                });
        }
        schema_view_on_modal();
        function bind_schema_table(data) {
            console.log(data);
            $("#model-view-schema").html("");
            var table_head = ["S.No", "Attribute Name", "Attribute Type"];
            var html = "<table className='table'>";
            html += "<thead><tr className='bg-light'>";
            $.each(table_head, function (index, value) {
                html += "<th>" + value + "</th>";
            });
            html += "</thead></tr><tbody>";
            $.each(data, function (index, row) {
                html += "<tr>";
                html += `<td> ${index + 1} </td>`;
                html += `<td> ${row.property_name}</td>`;
                html += `<td> ${row.property_type}</td>`;
                html += "<tr>";
            });
            html += "</tbody></table>";
            $("#model-view-schema").html(html);
        }

        return (
            <div className="wrapper1">
                {myVal()}
                <form className="shadow myForm">


                    <div className="mainComponentDropdown">
                        <span className="label">Simulation Type: </span>
                        <br />
                        <input type="radio" className="checkboxData" id="Rule_Based" onChange={this.removeMyHidden} name="simulation_type" value="Rule_Based" />
                        <Label for="Rule_Based" className="input">Rule Based</Label>

                        <input type="radio" id="Deep_Learning" onChange={this.addMyHidden} name="simulation_type" value="Deep_Learning" />
                        <Label for="Deep_Learning" className="input">Deep Learning</Label>
                    </div>
                    <br />
                    <div className="mainComponent">
                        <div className="childComponent">
                            <span className="label">Cloud Type:</span>

                            <select className="dropdown myDropdown" onChange={() => clodsrvicedetails()} id="cloud_type" name="cloud_type">


                            </select>

                        </div>
                        <div className="childComponent">
                            <span className="label mylabel">Cloud Services Type:</span>

                            <select className="dropdown myDropdowns" onChange={() => clodhubails()} id="cloud_service_type" name="cloud_type">


                            </select>
                        </div>

                    </div>
                    <br />
                    <div className="mainComponentDropdown">
                        <span className="label">Data Options: </span>
                        <br />
                        <input type="checkbox" id="telemetry" name="data_options" value="telemetry" onChange={this.addeDataOptionsHidden} className="" />
                        <Label for="telemetry" className="input">Normal Data</Label>
                        <input type="checkbox" id="anomaly" name="data_options" onChange={this.removeDataOptionsHidden} value="anomaly" className="input2" />
                        <Label for="anomaly" className="input">Anomaly</Label>
                    </div>
                    <br />
                    <div className="mainComponent myhideen" id="DataOption">
                        <div className="childComponent">
                            <span className="label">Attributes: </span>
                            <Input className="textfield atrib" type="text" id="attributes" name="attributes" />

                        </div>
                        <div className="childComponent">
                            <span className="label mylabel">Noise % </span><br />
                            <Input className="myDropdowns atrib" type="text" id="noise" name="noise" />

                        </div>


                    </div>



                    <div className="mainComponent">
                        <div className="childComponent">
                            <span className="label" id="hub_names">Hub Name:</span>


                        </div>

                        <div className="childComponent selectedShemaDiv" >

                            <div className="fixeddiv" id="selectedSchemahidden">
                                <span className="label mylabelshcema" >Selected Schema:</span>
                                <br />
                                {/* <input className="textfield mytextfiledse newClass" type="text"readOnly id="selected_schema" name="selected_schema" value="Loading..." disabled=""/> */}
                                <div className="schemaData">
                                    {/* <div className="textfield mytextfiledse"></div> */}
                                    {/* <Popup trigger={<button  id="view_schema_button"  className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base mybtn" data-toggle="modal" data-target="#exampleModal"> View</button>} 
                                        position="right center">
                                    <MypopupForm/>
                                    </Popup> */}

                                    <input className="shcemaseletedvalue" type="text" id="selected_schema" name="selected_schema" placeholder="Loading..." disabled />

                                    {/* <button id="view_schema_button" type="button" className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base mybtn" data-toggle="modal" data-target="#exampleModal" onClick={() => schema_view_on_modal()}>View</button> */}
                                    <button id="view_schema_button" type="button" className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base mybtn" data-toggle="modal" data-target="#exampleModal" onClick={e => {
                                        this.showModal(e);
                                    }}>{" "}View{" "}</button>

                                </div>
                            </div>


                            {/* <FaBeer /> */}


                        </div>






                    </div>

                    <div className="mainComponent">
                        <div className="childComponent selectedShemaDiv">
                            <div className="fixeddiv" id="timeDelayHidden">
                                <span className="label timeDeliy">Time Delay:<span className="myLabels ">(milliseconds)</span></span>

                                <input className="textfield mytextfileds" defaultValue={500} readOnly={true} type="text" id="time_delay" name="time_delay" />
                            </div>

                        </div>

                        <div className="childComponentShcema">
                            <div className="fixeddiv" id="deviceCount">
                                <span className="label mylabeled">Device Counts: </span>
                                <input className="mydevicecount myDropdowns atrib1" type="number" defaultValue={5} readOnly={true} id="device_count" name="device_count" />
                            </div>

                        </div>





                    </div>


                    <div className="mysubmitbtn">
                        <Button className="button startbtn" onClick={() => start_simulator()} type="button startbtn" id="btn_sim_start">
                            Start
                        </Button>
                        <Button className="button stopbtn" onClick={() => stop_simulator()} type="button" id="btn_sim_stop" >
                            Stop
                        </Button>
                    </div>
                </form>

                <Modal show={this.state.show} onHide={e => {
                    this.onClose(e);
                }}>
                    <Modal.Body>
                        <div className="modal-dialog modal-dialog-scrollable">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5>Schema Details:</h5>
                                    <button className="close close_schema_popup btn btn-danger" data-dismiss="modal" onClick={e => {
                                        this.onClose(e);
                                    }}>
                                        &times;
                                    </button>
                                </div>
                                <div className="modal-body" id="model-view-schema" >

                                </div>

                                <div className="modal-footer">

                                    <button type="button" data-dismiss="modal" className="btn btn-danger" onClick={e => {
                                        this.onClose(e);
                                    }}>Close</button>


                                    <button type="button" data-dismiss="modal" class="btn btn-primary">
                                        Ok
                                    </button>
                                </div>


                            </div>
                        </div>
                    </Modal.Body>

                </Modal>


            </div>



        );
    }
}