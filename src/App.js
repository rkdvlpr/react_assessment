import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CircularProgress, Box, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import http from "./utils/http";
import { CLOSE_SNACKBAR } from "./store/common";
import { SET_USER, SET_TOKEN } from "./store/auth";

import AdminLayout from "./layouts/AdminLayout";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import States from "./pages/state";
import BatchType from "./pages/batch/batch_type";
import BatchScheme from "./pages/batch/batch_scheme";
import CityList from "./pages/state/citylist";
import Roles from "./pages/roles";
import Users from "./pages/users";
import Sectors from "./pages/sectors";
import Jobroles from "./pages/jobroles";
import JobroleForm from "./pages/jobroles/form";
import Batch from "./pages/batch";
import BatchForm from "./pages/batch/form";
import BatchImport from "./pages/batch/import";
import CandidateBatchList from "./pages/candidates";
import CandidateBatchCandidateList from "./pages/candidates/candidate_list";
import CandidateImport from "./pages/candidates/import";
import CandidateForm from "./pages/candidates/form";
import Assessor from "./pages/assessor";
import AssessorImport from "./pages/assessor/import";
import AssessorForm from "./pages/assessor/form";
import MailTemplate from "./pages/mail_template";
import MailTemplateForm from "./pages/mail_template/form";
import Profile from "./pages/Profile";
import Language from "./pages/language";
import DifficultyLevel from "./pages/difficulty_level";
import Question from "./pages/question";
import QuestionForm from "./pages/question/form";
import QuestionImport from "./pages/question/import";
import Strategy from "./pages/strategy";
import StrategyForm from "./pages/strategy/form";
import Blank from "./pages/blank";

const token = localStorage.getItem("token");

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function App() {
  const dispatch = useDispatch();
  const snackbar = useSelector(state => state.common.snackbar);
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    if (token) {
      http.get('/api/auth').then((res) => {
        dispatch(SET_USER(res.data));
      }).catch((error) => {
        dispatch(SET_USER({}));
        dispatch(SET_TOKEN(''));
      })
    } else {
      dispatch(SET_USER({}));
      dispatch(SET_TOKEN(''));
    }
    return () => true
  }, [dispatch]);

  if (user == null) {
    return <Box className="flex h-screen w-screen items-center justify-center">
      <CircularProgress />
    </Box>
  }

  const handleCloseSnack = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    dispatch(CLOSE_SNACKBAR({}));
  };

  return (
    <div>
      <BrowserRouter>
        <Routes>
          {Object.keys(user).length > 0 ? <Route path="/" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="/state" element={<States />} />
            <Route path="/batch-type" element={<BatchType />} />
            <Route path="/project-category" element={<BatchScheme />} />
            <Route path="/state/:id" element={<CityList />} />
            <Route path="/roles" element={<Roles />} />
            <Route path="/users" element={<Users />} />
            <Route path="/sectors" element={<Sectors />} />
            <Route path="/jobroles" element={<Jobroles />} />
            <Route path="/jobroles/add" element={<JobroleForm />} />
            <Route path="/jobroles/:id/edit" element={<JobroleForm />} />
            <Route path="/batch" element={<Batch />} />
            <Route path="/batch/add" element={<BatchForm />} />
            <Route path="/batch/import" element={<BatchImport />} />
            <Route path="/batch/:id/edit" element={<BatchForm />} />
            <Route path="/candidate" element={<CandidateBatchList />} />
            <Route path="/candidate/import" element={<CandidateImport />} />
            <Route path="/candidate/add" element={<CandidateForm />} />
            <Route path="/candidate/:id/edit" element={<CandidateForm />} />
            <Route path="/candidate/:id/list" element={<CandidateBatchCandidateList />} />
            <Route path="/assessor" element={<Assessor />} />
            <Route path="/assessor/import" element={<AssessorImport />} />
            <Route path="/assessor/add" element={<AssessorForm />} />
            <Route path="/assessor/:id/edit" element={<AssessorForm />} />
            <Route path="/mail-template" element={<MailTemplate />} />
            <Route path="/mail-template/add" element={<MailTemplateForm />} />
            <Route path="/mail-template/:id/edit" element={<MailTemplateForm />} />
            <Route path="/language" element={<Language />} />
            <Route path="/difficulty-level" element={<DifficultyLevel />} />
            <Route path="/question" element={<Question />} />
            <Route path="/question/import" element={<QuestionImport />} />
            <Route path="/question/add" element={<QuestionForm />} />
            <Route path="/question/:id/edit" element={<QuestionForm />} />
            <Route path="/strategy" element={<Strategy />} />
            <Route path="/strategy/add" element={<StrategyForm />} />
            <Route path="/strategy/:id/edit" element={<StrategyForm />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/blank" element={<Blank />} />
            <Route path="*" element={<NotFound />} />
          </Route>
            :
            <Route path="*" element={<Login />}></Route>
          }
        </Routes>
      </BrowserRouter>
      <Snackbar open={snackbar.status} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} autoHideDuration={snackbar.duration || null} onClose={handleCloseSnack}>
        <Alert onClose={handleCloseSnack} severity={snackbar.type} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </div>
  );
}

export default App;
