    if(typeof( mds ) == "undefined") {
    var mds = {}
}
mds.chart = {
    chartOptions: {    
        'width':340,
        'height':165,
        'is3D': true,
        'backgroundColor': '#eeeeee',
        'chartArea': {
            left: 5,
            top: 5,
            width:"100%",
            height:"100%"
        },
        'legendTextStyle': {
            color: 'black', 
            fontSize: '12px'
        },
        'pieSliceTextStyle': {
            color: 'black', 
            fontSize: '12px'
        }
    },
    toNumber: function (val) {
        var temp = (val+'').replace(',', '.');
        temp = val.replace(' ', '');
        return parseFloat(temp);
    },
    createEconomyChart: function(row, div) {
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Topping');
        data.addColumn('number', 'Slices');
        data.addRows([
            ['Agriculture', mds.chart.toNumber(row[10])],
            ['Industrie', mds.chart.toNumber(row[11])],
            ['Construction', mds.chart.toNumber(row[12])],
            ['Commerce & Serivces', mds.chart.toNumber(row[13])],
            ['Fonction publique', mds.chart.toNumber(row[15])]
            ]);
        var chart = new google.visualization.PieChart($('#'+div).get(0));
        chart.draw(data, mds.chart.chartOptions);      
    },
    createLogementChart: function(row, div) {
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Topping');
        data.addColumn('number', 'Slices');
        data.addRows([
            ['Residence principale', mds.chart.toNumber(row[19])],
            ['Residence secondaire', mds.chart.toNumber(row[20])],
            ['Logement vacant', mds.chart.toNumber(row[21])],
            ]);
        var chart = new google.visualization.PieChart($('#'+div).get(0));
        chart.draw(data, mds.chart.chartOptions);      
    },
    createEmploiChart: function (row, div) {
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Topping');
        data.addColumn('number', 'Slices');
        var actif = mds.chart.toNumber(row[3]);
        var chomage = mds.chart.toNumber(row[4]);
        var autre = 100.0-(actif+chomage);
        data.addRows([
            ['Actifs 15-64 ans', actif],
            ['Chômage 15-64 ans', chomage],
            ['Autres 15-64 ans', autre]    
            ]);
        var chart = new google.visualization.PieChart($('#'+div).get(0));
        chart.draw(data, mds.chart.chartOptions);      
    },
    createRevenuChart: function (row, div) {
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Topping');
        data.addColumn('number', 'Slices');
        var imposable = mds.chart.toNumber(row[34]);
        var nimposable = 100-(imposable);
        data.addRows([
            ['Imposables', imposable],
            ['Non imposables', nimposable]
            ]);
        var chart = new google.visualization.PieChart($('#'+div).get(0));
        chart.draw(data, mds.chart.chartOptions);      
    },

    createPopulationChart: function (row, div) {
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Topping');
        data.addColumn('number', 'Slices');
        data.addRows([
            ['Naissances', mds.chart.toNumber(row[31])],
            ['Décès', mds.chart.toNumber(row[32])]
            ]);
        var chart = new google.visualization.PieChart($('#'+div).get(0));
        chart.draw(data, mds.chart.chartOptions);      
    },

    createCalendarChart:function (stats, selector) {
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Topping');
        data.addColumn('number', 'Slices');

        for(stat in stats) {
            data.addRow([stat, stats[stat].count]);
        }
        var chart = new google.visualization.PieChart(selector.get(0));
        var options = { 
            width: 270,
            height: 185,
            is3D: true,
            backgroundColor: '#f6f6f6',
            chartArea: {
                left: 5,
                right: 5,
                top: 5,
                width:"95%",
                height:"95%"
            },
            'legendTextStyle': {
                color: 'black'
//                fontSize: '1em'
            },
            'pieSliceTextStyle': {
                color: 'white' 
//                fontSize: '1em'
            }
        };
        chart.draw(data, options);      
    }
    
}