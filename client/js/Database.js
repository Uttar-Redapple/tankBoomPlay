var Database = {
    //Save Data
    SaveData: function(key, value) {
        localStorage.setItem(key, value);
    },
    //Load Data
    LoadData: function(key) {
        if (localStorage.getItem(key) != null) {
            return localStorage.getItem(key);
        } else {
            this.SaveData(key, "0");
            return localStorage.getItem(key);
        }
    },
};