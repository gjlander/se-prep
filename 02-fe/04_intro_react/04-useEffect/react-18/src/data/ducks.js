const getAllDucks = async () => {
    const res = await fetch('https://duckpond-89zn.onrender.com/ducks/');
    if (!res.ok) throw new Error(`${res.status}. Something went wrong!`);
    const data = await res.json();
    // console.log(data);

    return data;
};

export { getAllDucks };
