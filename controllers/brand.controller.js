const Brand = require("../models/brand.model");
const slugify = require("slugify");

exports.createBrand = async (req, res) => {
  const { name, image } = req.body;

  const exist = await Brand.findOne({ name });
  if (exist) return res.status(400).json({ message: "Brand exists" });

  const brand = await Brand.create({
    name,
    slug: slugify(name, { lower: true }),
    image,
  });

  res.status(201).json(brand);
};

exports.getBrands = async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;

  const brands = await Brand.find({
    name: { $regex: search, $options: "i" },
  })
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });

  res.json(brands);
};

exports.getBrand = async (req, res) => {
  const { id } = req.params;

  const brand =
    (await Brand.findById(id)) ||
    (await Brand.findOne({ slug: id }));

  if (!brand) return res.status(404).json({ message: "Not found" });

  res.json(brand);
};

exports.updateBrand = async (req, res) => {
  const { name, image } = req.body;

  const updateData = {
    ...(name && { name, slug: slugify(name, { lower: true }) }),
    ...(image && { image }),
  };

  const brand = await Brand.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true }
  );

  res.json(brand);
};

exports.deleteBrand = async (req, res) => {
  await Brand.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};
