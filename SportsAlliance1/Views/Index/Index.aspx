<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Index.aspx.cs" Inherits="SportsAlliance1.Views.Index.Index" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">

    <script src="Index.js"></script>
    <script src="Prueba.js"></script>
<%--    <!--Slect2-->
    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
    <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>

    <!--DataTable-->

    <link href="<%= ResolveUrl("~/Scripts/DataTables/DataTables-1.10.18/css/dataTables.bootstrap4.min.css") %>" rel="stylesheet" />
    <link href="<%= ResolveUrl("~/Scripts/DataTables/DataTables-1.10.18/css/responsive.bootstrap4.min.css") %>" rel="stylesheet" />
    <script type="text/javascript" src="<%= ResolveUrl("~/Scripts/DataTables/datatables.min.js") %>"></script>
    <script src="<%= ResolveUrl("~/Scripts/DataTables/DataTables-1.10.18/js/jquery.dataTables.min.js") %>" type="text/javascript"></script>
    <script src="<%= ResolveUrl("~/Scripts/DataTables/DataTables-1.10.18/js/dataTables.bootstrap4.min.js") %>" type="text/javascript"></script>

    <link href="../../Scripts/DatePicker/jquery-ui.css" rel="stylesheet" />
    <script src="../../Scripts/DatePicker/jquery-ui.js"></script>
    <link href="../../Scripts/DatePicker/jquery-ui.structure.css" rel="stylesheet" />
    <link href="../../Scripts/DatePicker/jquery-ui.theme.css" rel="stylesheet" />

    <!--BlockUI-->
    <script src="<%= ResolveUrl("~/Scripts/BlockUI/jquery.blockUI.js") %>" type="text/javascript"></script>

    <!--Growl-->
    <link href="../../Scripts/Growl/jquery.growl.css" rel="stylesheet" />
    <script src="<%= ResolveUrl("~/Scripts/Growl/jquery.growl.js") %>"></script>--%>

    

</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="Content" runat="server">
    <div class="body-content">
        <div class="row">
        <div class="col-md-1">
            <a href="Index.aspx">
                <h6 style="font-size: 30px; cursor: pointer; text-decoration: underline;">Inicio</h6>
            </a>
        </div>
        
    </div>
        <div class="row" style="width: 105%">
            <div class="col-md-12 text-center" id="selectTo">
                <select id="cboLiga" class="select2 form-control form-select" required style="width: 50%"></select>
            </div>
            <div class="col-md-5 text-center">
                <br />
                <!--Div de las jornadas-->
                <div  class="table-responsive-lg" id="divTablaJornadas">
                    
                </div>
            </div>

            <div class="col-md-7 text-center">
                <br />
                <!--Div de los puntos-->
                <div><h1 id="text1"></h1></div>
                <div class="table-responsive-lg" id="divTablaPuntos"></div>
            </div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="dialog" runat="server">
</asp:Content>
