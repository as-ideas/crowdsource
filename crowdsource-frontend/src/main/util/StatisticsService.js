import RequestUtil from "./RequestUtil";

const StatisticsService = {};

StatisticsService.getCurrentStatistics = (data) => {
  return fetch(RequestUtil.appendParameterToUrl("/statistics/current", data))
    .then((result) => result.json());
};

StatisticsService.getProjectsPerStatus = () => {
  return fetch("/statistics/projects_per_status")
    .then((result) => result.json());
};

StatisticsService.getCommentCountPerProject = (data) => {
  return fetch(RequestUtil.appendParameterToUrl("/statistics/comment_count_per_project", data))
    .then((result) => result.json());
};

StatisticsService.getSumComments = (data) => {
  return fetch(RequestUtil.appendParameterToUrl("/statistics/comments/sum", data))
    .then((result) => result.json());
};

export default StatisticsService;
