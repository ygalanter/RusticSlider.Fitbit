function mySettings(props) {
  return (
    <Page>
      <Section
        title={<Text bold align="center">Rustic Slider Clock Settings</Text>}>
      
        <Select
          label={`Time digit animation`}
          settingsKey="timeDigitanimation"
          options={[
            {name:"Disable Always", value:"0"},
            {name:"Disable on Screen wakeup", value:"1"},
            {name:"Enable always", value:"2"}
          ]}
        />
        
        
      </Section>
    </Page>
  );
}

registerSettingsPage(mySettings);