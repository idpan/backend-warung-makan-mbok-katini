const Menu = require("../models/Menu");
const responseMenu = (data) => {
  const menuSatuan = data.filter((item) => {
    return item.category === "menu_satuan";
  });
  const tumpeng = data.filter((item) => {
    return item.category === "tumpeng";
  });
  const nasiBox = data.filter((item) => {
    return item.category === "nasi_box";
  });
  const newData = {
    menu_satuan: menuSatuan,
    tumpeng,
    nasi_box: nasiBox,
  };
  return newData;
};
//get all menu
const getMenu = async (req, res) => {
  try {
    const data = await Menu.all();
    res
      .status(200)
      .json({ mssg: "get menu success", data: responseMenu(data) });
  } catch (error) {
    res.status(400).json({ mssg: error.message });
  }
};
// create a menu
const createMenu = async (req, res) => {
  const allowedCollums = [
    "name",
    "description",
    "category",
    "sub_category",
    "image",
  ];
  const values = {};
  for (const key in req.body) {
    if (req.body.hasOwnProperty(key) && allowedCollums.includes(key)) {
      values[key] = req.body[key];
    }
  }

  try {
    const { insertId } = await Menu.create(values);
    const data = await Menu.find(insertId);
    res.status(200).json({ mssg: "new menu created succesfully", data: data });
  } catch (error) {
    res.status(400).json({ mssg: error.message });
  }
};
// update menu
const updateMenu = async (req, res) => {
  const menuId = req.params.id;
  const allowedCollums = [
    "name",
    "description",
    "category",
    "sub_category",
    "image",
  ];
  let updateQuery = "UPDATE menu SET ";
  const updatedCollums = [];
  const values = [];

  for (const key in req.body) {
    if (req.body.hasOwnProperty(key) && allowedCollums.includes(key)) {
      updatedCollums.push(`${key} = ?`);
      values.push(req.body[key]);
    }
  }

  // minimum 1 data update
  if (updatedCollums.length === 0) {
    return res
      .status(400)
      .json({ error: "Minimal satu data yang ingin diupdate" });
  }
  updateQuery += updatedCollums.join(", ");
  updateQuery += " WHERE id_menu = ?";
  values.push(menuId);

  try {
    await Menu.update(updateQuery, values);
    const data = await Menu.find(menuId);
    // check if data does not exist
    if (data.length === 0) {
      throw Error(`menu with id ${menuId} does not exist `);
    }
    res.status(200).json({
      mssg: "content updated succesfully",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// delete menu
const deleteMenu = async (req, res) => {
  const menuId = req.params.id;
  try {
    const data = await Menu.find(menuId);
    // check if data does not exist
    if (data.length === 0) {
      throw Error(`menu with id ${menuId} does not exist `);
    }
    await Menu.deleteMenu(menuId);
    // await Menu.deleteMenu(menuId);
    res.status(200).json({
      mssg: `menu with id = ${menuId} deleted succesfully`,
      data: data,
    });
  } catch (error) {
    res.status(400).json({ mssg: error.message });
  }
};

module.exports = { getMenu, createMenu, updateMenu, deleteMenu };
