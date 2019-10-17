import React from 'react'
import StatisticsService from "../../util/StatisticsService";
import DatePicker from "react-datepicker";
import {Bar, Line} from "react-chartjs-2";
import {I18n} from "@lingui/react";
import PageMeta from "../../layout/PageMeta";
import {t} from "@lingui/macro";

const STATISTICS_CONST = {
  TIME_PRECISION_TYPE: {
    DAY: {
      id: "DAY",
      label: "Tag",
      precision: 1
    }
    //,
    //WEEK: {
    //    id: "WEEK",
    //    label: "Woche",
    //    precision: 7
    //},
    //MONTH: {
    //    id: "MONTH",
    //    label: "Monat",
    //    precision: 30
    //}
  },
  PAGES: {
    NONE: {
      label: "-- Bitte auswählen --",
      name: "NONE"
    },
    CURRENT: {
      label: "Anzahl Neuregistrieung / Neu eingereichte Ideen",
      name: "CURRENT"
    },
    PROJECT_SUM_PER_STATUS: {
      label: "Projekte je Projektstatus",
      name: "PROJECT_SUM_PER_STATUS"
    },
    COMMENT_SUM_PER_PROJECT: {
      label: "Kommentare je Projekt",
      name: "COMMENT_SUM_PER_PROJECT"
    },
    COMMENT_SUM: {
      label: "Anzahl Kommentare",
      name: "COMMENT_SUM"
    }
  },
  COUNT: {
    THREE: {
      label: "Top Drei",
      value: 3
    },
    FIVE: {
      label: "Top Fünf",
      value: 5
    },
    TEN: {
      label: "Top Zehn",
      value: 10
    },

  }
};

const DEFAULT_FROM_DAYS = 14;

export default class StatisticsPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      input: {
        timePrecision: STATISTICS_CONST.TIME_PRECISION_TYPE.DAY,
        statisticType: STATISTICS_CONST.PAGES.NONE.name,
        projectCount: STATISTICS_CONST.COUNT.FIVE,
        startDate: undefined,
        endDate: undefined,
      },
      data: {},
      chart: {}
    };

    this.initChartData = this.initChartData.bind(this);
    this.defaultErrorHandler = this.defaultErrorHandler.bind(this);
    this.prepareDataForLineChart = this.prepareDataForLineChart.bind(this);
    this.prepareDataForBarChart = this.prepareDataForBarChart.bind(this);
    // this.statisticTypeChanged = this.statisticTypeChanged.bind(this);

    this.initChartData();
  }

  componentDidMount() {
  }

  initChartData() {
    let chart = this.state.chart;
    chart.data = {
      labels: [],
      datasets: []
    };

    this.sanitizeStartDate();
    this.sanitizeEndDate();
    this.setState(this.state);
  }

  sanitizeStartDate() {
    let now = new Date();
    this.state.input.startDate = this.state.input.startDate || new Date(now.getFullYear(), now.getMonth(), now.getDate() - DEFAULT_FROM_DAYS)
  }

  sanitizeEndDate() {
    let now = new Date();
    this.state.input.endDate = this.state.input.endDate || now;
  }

  statisticTypeChanged = () => {
    let statisticType = this.state.input.statisticType;

    if (statisticType === STATISTICS_CONST.PAGES.CURRENT.name) {
      this.sanitizeStartDate();
      this.sanitizeEndDate();

      StatisticsService.getCurrentStatistics({startDate: this.state.input.startDate, endDate: this.state.input.endDate})
        .then(this.prepareDataForLineChart)
        .catch(this.defaultErrorHandler);
    } else if (statisticType === STATISTICS_CONST.PAGES.PROJECT_SUM_PER_STATUS.name) {
      StatisticsService.getProjectsPerStatus()
        .then(this.prepareDataForBarChart)
        .catch(this.defaultErrorHandler);
    } else if (statisticType === STATISTICS_CONST.PAGES.COMMENT_SUM_PER_PROJECT.name) {
      StatisticsService.getCommentCountPerProject({projectCount: this.input.projectCount.value})
        .then(this.prepareDataForBarChart)
        .catch(this.defaultErrorHandler);
    } else if (statisticType === STATISTICS_CONST.PAGES.COMMENT_SUM.name) {
      this.sanitizeStartDate();
      this.sanitizeEndDate();

      StatisticsService.getSumComments({startDate: this.state.input.startDate, endDate: this.state.input.endDate})
        .then(this.prepareDataForLineChart)
        .catch(this.defaultErrorHandler);
    } else {
      console.error("Unknown statisticType", statisticType);
    }
  }

  defaultErrorHandler(error) {
    console.error(error);
    this.state.data.info = "Ooooops! Da ist etwas schief gelaufen!";
    this.setState(this.state);
  }

  prepareDataForLineChart(response) {
    this.state.data.statisticsResponse = response;
    this.initChartData();

    let chart = this.state.chart;
    let data = this.state.data;


    chart.renderBar = false;
    chart.renderLine = true;

    data.statisticsResponse
      .forEach((seriesEntry) => {
        let dataset = {
          label: seriesEntry.name,
          data: []
        };
        chart.data.labels = [];
        chart.data.datasets.push(dataset);

        seriesEntry.data.forEach((dataEntry) => {
          chart.data.labels.push(dataEntry.label);
          dataset.data.push(dataEntry.data);
        });
      });

    this.setState(this.state);
  }

  prepareDataForBarChart(response) {
    this.state.data.statisticsResponse = response;
    this.initChartData();

    let data = this.state.data;
    let chart = this.state.chart;

    chart.renderBar = true;
    chart.renderLine = false;

    data.statisticsResponse.forEach((entry) => {
      chart.data.push(entry.count);
      chart.labels.push(entry.name);
    });

    this.setState(this.state);
  }

  showResults() {
    return this.state.input.statisticType !== STATISTICS_CONST.PAGES.NONE.name;
  }

  dateChanged() {
    this.statisticTypeChanged();
  }

  clearInfo() {
    this.state.data.info = undefined;
    this.setState(this.state);
  }

  shouldShowDatePickerWithPrecision() {
    return this.state.input.statisticType !== undefined
      && (STATISTICS_CONST.PAGES.CURRENT.name === this.state.input.statisticType
        || STATISTICS_CONST.PAGES.COMMENT_SUM.name === this.state.input.statisticType);
  }

  shouldShowCountPicker() {
    return this.state.input.projectCount !== undefined
      && STATISTICS_CONST.PAGES.COMMENT_SUM_PER_PROJECT.name === this.state.input.statisticType;
  }

  handleStartDateInputChange(date) {
    this.state.input.startDate = date;
    this.setState(this.state, this.validateForm);
    this.prepareDataForLineChart();
  }


  handleEndDateInputChange(date) {
    this.state.input.endDate = date;
    this.setState(this.state, this.validateForm);
    this.prepareDataForLineChart();
  }

  handleStatisticTypeInputChange(e) {
    this.state.input.statisticType = e.target.value;
    this.setState(this.state, this.validateForm);
    this.statisticTypeChanged();
  }

  handleTimePrecisionInputChange(e) {
    this.state.input.timePrecision = e.target.value;
    this.setState(this.state, this.validateForm);
    this.prepareDataForLineChart();
  }

  handleProjectCountInputChange = (e) => {
    this.state.input.projectCount = e.target.value;
    this.setState(this.state, this.validateForm);
    this.prepareDataForLineChart();
  }

  validateForm() {

  }

  render() {
    let data = this.state.data;
    let chart = this.state.chart;

    return (
      <content-row>
        <I18n>
          {({i18n}) => (
            <PageMeta title={i18n._(t("NAV_LABEL_STATISTIC")`Statistiken`)}/>
          )}
        </I18n>
        <div className="container">
          <statistics-form>
            <h2 className="plist__heading push-dble--bottom">Statistiken</h2>

            {
              data.info ?
                <div className="alert-box alert-box__statistics info">
                  {data.info}
                  <span className="close" ng-click="clearInfo()">&times;</span>
                </div> : null
            }

            <div className="panel">
              <div className="row">
                <div className="statistics-form small-12 columns">

                  <select className="statistics-form-type-select-dropdown"
                          name="statistic-type"
                          value={this.state.input.statisticType}
                          onChange={this.handleStatisticTypeInputChange.bind(this)}
                  >
                    {
                      Object.keys(STATISTICS_CONST.PAGES).map((element) => {
                        let page = STATISTICS_CONST.PAGES[element];
                        return <option value={page.name}>{page.label}</option>
                      })
                    }
                  </select>

                </div>
              </div>

              {
                this.shouldShowDatePickerWithPrecision() ?
                  <div className="row statistics-form-datepicker" ng-if="shouldShowDatePickerWithPrecision()">
                    <div className="small-12 medium-4 large-4 columns form-controls-startdate">
                      <label>
                        <DatePicker
                          selected={this.state.input.startDate}
                          onChange={this.handleStartDateInputChange.bind(this)}
                          className="statistics-startdate"
                          name="startDate"
                          dateFormat="dd.MM.yyyy"
                          maxDate={new Date()}
                        />
                      </label>
                    </div>
                    <div className="small-12 medium-4 large-4 columns form-controls-enddate">
                      <label>
                        <DatePicker
                          selected={this.state.input.endDate}
                          onChange={this.handleEndDateInputChange.bind(this)}
                          className="statistics-enddate"
                          name="endDate"
                          dateFormat="dd.MM.yyyy"
                          maxDate={new Date()}
                        />
                      </label>
                    </div>
                    <div className="small-12 medium-4 large-4 columns form-control-timeprecision">
                      <select name="statistics-time-precision"
                              value={this.state.input.timePrecision}
                              onChange={this.handleTimePrecisionInputChange.bind(this)}
                              readonly
                              disabled
                      >
                        {
                          Object.keys(STATISTICS_CONST.TIME_PRECISION_TYPE).map((element) => {
                            let item = STATISTICS_CONST.TIME_PRECISION_TYPE[element];
                            return <option value={item.precision}>{item.label}</option>
                          })
                        }
                      </select>
                    </div>
                  </div>
                  : null
              }


              {
                this.shouldShowCountPicker() ?
                  <div className="row statistics-form-comments-per-project">
                    <div className="small-12 medium-4 large-4 columns form-control-project-count">
                      <select name="statistics-project-count"
                              value={this.state.input.projectCount}
                              onChange={this.handleProjectCountInputChange.bind(this)}
                      >
                        {
                          Object.keys(STATISTICS_CONST.COUNT).map((element) => {
                            let item = STATISTICS_CONST.COUNT[element];
                            return <option value={item.value}>{item.label}</option>
                          })
                        }

                      </select>
                    </div>
                  </div>
                  : null
              }

            </div>
          </statistics-form>

          <statistics-result>
            {
              this.showResults() ?
                <div className="panel statistic-result">
                  <div className="row">
                    <div className="small-12 columns">

                      <div className="panel">
                        <div className="row">
                          <div className="columns">

                            {
                              chart.renderLine ?
                                <div className="chart-container-line">
                                  <Line className="chart chart-line"
                                        data={chart.data}
                                  />
                                </div>
                                : null
                            }
                            {
                              chart.renderBar ?
                                <div className="chart-container-pie">
                                  <Bar className="chart chart-pie"
                                       data={chart.data}
                                  />
                                </div>
                                : null
                            }

                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                : null
            }

          </statistics-result>
        </div>
      </content-row>
    )
  }
}
