import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import axios from "axios";
import { IconButton, List, ListItem, ListItemText } from "@material-ui/core";
import QuestionForm from "../Question_form";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    padding: "20px",
    backgroundColor: "#f4f4f4",
  },
  tab: {
    fontSize: 12,
    color: "#5f6368",
    textTransform: "capitalize",
    height: 10,
    fontWeight: "600",
    fontFamily: "Google Sans,Roboto,Arial,sans-serif",
  },
  tabs: {
    height: 10,
  },
  userSection: {
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "8px",
  },
  userHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  userAnswers: {
    marginTop: "20px",
  },
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function CenteredTabs() {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const [responses, setResponses] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userResponses, setUserResponses] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === 1) {
      fetchResponses();
    }
  };

  const fetchResponses = async () => {
    try {
      const response = await axios.get("https://serverformify.onrender.com/responses");
      const data = response.data.map((item) => {
        const score = item.answers.reduce((acc, answer) => (answer.isCorrect ? acc + 1 : acc), 0);
        return {
          ...item,
          score,
        };
      });
      setResponses(data);
    } catch (error) {
      console.error("Error fetching responses:", error);
    }
  };

  const handleUserClick = async (user) => {
    setSelectedUser(user);
    setUserResponses(user.answers);
  };

  return (
    <Paper className={classes.root}>
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        centered
        className={classes.tabs}
      >
        <Tab label="Questions" className={classes.tab} {...a11yProps(0)} />
        <Tab label="Responses" className={classes.tab} {...a11yProps(1)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <QuestionForm />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <div className={classes.userSection}>
          <div className={classes.userHeader}>
            <Typography variant="h6">List of Users who filled the form</Typography>
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          </div>
          <List>
            {responses.map((user) => (
              <ListItem key={user._id} button onClick={() => handleUserClick(user)}>
                <ListItemText primary={user.userName} secondary={`Score: ${user.score}`} />
              </ListItem>
            ))}
          </List>
          {selectedUser && (
            <div className={classes.userAnswers}>
              <Typography variant="h6">User: {selectedUser.userName}</Typography>
              <List>
                {userResponses.map((response, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={`Question: ${response.question}`}
                      secondary={`Answer: ${response.answer}`}
                    />
                  </ListItem>
                ))}
              </List>
            </div>
          )}
        </div>
      </TabPanel>
    </Paper>
  );
}
