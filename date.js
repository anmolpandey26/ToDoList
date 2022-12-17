//jshint esversion:6

exports.getDate= function (){
    const today = new Date();
   
    const options={
        weekday:"long",
        day:"numeric",
        month:"long"
    };

    return today.toLocaleDateString("hi-IN",options);
}

exports.getDay= function (){
    const din= new Date();

    const options={
        weekday: "long"
    };

    return din.toLocaleDateString("hi-IN",options);

}
