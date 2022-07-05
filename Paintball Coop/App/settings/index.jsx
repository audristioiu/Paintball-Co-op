
function SettingsPage(props) {
  return (
      <Page>
      <TextInput
            label="Username : "
            settingsKey = "username"
            disabled={!(props.settings.toggleTextInput === "true")}
       />
      <Oauth
      settingsKey="oauth"
      title="OAuth Login"
      label="OAuth"
      status="Login"
      authorizeUrl="https://www.fitbit.com/oauth2/authorize"
      requestTokenUrl="https://api.fitbit.com/oauth2/token"
      clientId="2387BT"
      clientSecret="4adacbe1eee7b02bd661c4ec73cf258e"
      scope="profile"
      pkce
       />
       <TextInput
         label="Enter Fitbit profile user ID"
         settingsKey = "userID"
        />
      <Section
          title={<Text bold align="center">Statistics</Text>}>
          <TextInput
            label="Time elapsed in game :"
            settingsKey = "time"
            disabled={!(props.settings.toggleTextInput === "true")}
          />
          <TextInput
            label="Number of games played :"
            settingsKey = "nr_games"
            disabled={!(props.settings.toggleTextInput === "true")}
          />
          <TextInput
            label="Percentage of wins :"
            settingsKey = "perc_wins"
            disabled={!(props.settings.toggleTextInput === "true")}
          />
          <TextInput
            label="Guessed shot rate : "
            settingsKey = "gs_rate"
            disabled={!(props.settings.toggleTextInput === "true")}         
          />
         <TextInput
            label="Number or bullets : "
            settingsKey = "nr_bullets"
           disabled={!(props.settings.toggleTextInput === "true")}    
          />
      </Section>
      <Section
          title={<Text bold align="center">Create Private Game</Text>}>
            <TextInput
              label="Session name"
              settingsKey="userGame"
             />
             <TextInput
              label="Password"
              settingsKey="passGame"
             />
         </Section>
        <Section
          title={<Text bold align="center">Join Private Game</Text>}>
             <TextInput
              label="Password"
              settingsKey="passtext"
             />
       </Section>
        <Section
           title={<Text bold align="center">Choose spawn</Text>}>
           <TextInput
              label="Enter spawn point index(Choose between 1 and 2)"
              settingsKey="enemyIndex"
             />
           </Section>
           <Section
            description={<Text>1.Team  2.Enemy</Text>} 
            title={<Text bold align="center">Options</Text>}>
            
            <ColorSelect
              
              settingsKey="myColor"
              colors={[
                {color: 'dodgerblue'},
                {color: 'crimson'},
                {color: 'gold'},
                {color: 'royalblue'},
                {color: 'fuchsia'},
                {color: 'plum'}
              ]}
            />
            <ColorSelect
              settingsKey="myColor1"
              colors={[
                {color: 'tomato'},
                {color: 'sandybrown'},
                {color: 'darkslategrey'},
                {color: 'indigo'},
                {color: 'deepskyblue'},
                {color: 'yellow'}
              ]}
            />
      </Section>
       </Page>
  );
}
registerSettingsPage(SettingsPage);