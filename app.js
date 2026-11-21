// SETUP: replace this sample value with your WhatsApp number including country code, digits only.
    // Example format for India: 91 followed by the 10-digit mobile number. Do not include +, spaces or dashes.
    const WHATSAPP_NUMBER = "91XXXXXXXXXX";

    // DEMO PRODUCTS: replace names, categories, prices and artwork with your real, general-audience products.
    const products = [
      {id:1,name:"Everyday Backpack",category:"Accessories",price:1299,art:"#dce2cf",shape:"bag",tone:"#77845e"},
      {id:2,name:"Wireless Headphones",category:"Tech",price:1899,art:"#e5ded4",shape:"headphones",tone:"#33352f"},
      {id:3,name:"Minimal Desk Lamp",category:"Home",price:999,art:"#e9e3d2",shape:"lamp",tone:"#b7a777"},
      {id:4,name:"Steel Water Bottle",category:"Accessories",price:549,art:"#d9e5e3",shape:"bottle",tone:"#718f8a"},
      {id:5,name:"Travel Organizer",category:"Travel",price:799,art:"#e8dccc",shape:"organizer",tone:"#8b765d"},
      {id:6,name:"Daily Carry Tote",category:"Travel",price:699,art:"#e1e4d8",shape:"bag",tone:"#969b7b"}
    ];
    const cart = new Map();
    let activeFilter = "All";
    const money = n => "₹" + n.toLocaleString("en-IN");
    const $ = id => document.getElementById(id);

    function renderProducts(){
      const term = $("search").value.trim().toLowerCase();
      const shown = products.filter(p => (activeFilter === "All" || p.category === activeFilter) && (p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term)));
      $("productGrid").innerHTML = shown.length ? shown.map(p => `
        <article class="product">
          <div class="product-art" style="--art:${p.art};--shape:${p.tone}"><span class="demo-tag">Sample listing</span><div class="shape ${p.shape}"></div></div>
          <div class="product-info"><div class="product-top"><h3>${p.name}</h3><span class="price">${money(p.price)}</span></div><div class="category">${p.category}</div><div class="product-actions"><button class="add" data-add="${p.id}">Add to bag +</button><span class="small-note">Demo price</span></div></div>
        </article>`).join("") : `<p class="small-note">No matching products. Try another search.</p>`;
    }
    function renderCart(){
      const items = [...cart.entries()];
      $("bagCount").textContent = items.reduce((sum,[,qty])=>sum+qty,0);
      if(!items.length){$("cartItems").innerHTML='<div class="cart-empty">Your bag is empty.<br>Explore the collection to add an item.</div>';$("subtotal").textContent=money(0);return;}
      let total=0;
      $("cartItems").innerHTML=items.map(([id,qty])=>{const p=products.find(x=>x.id===id);total+=p.price*qty;return `<div class="cart-row"><div><strong>${p.name}</strong><small>${money(p.price)} each</small></div><div class="qty"><button data-qty="${id}" data-change="-1" aria-label="Decrease ${p.name}">−</button><span>${qty}</span><button data-qty="${id}" data-change="1" aria-label="Increase ${p.name}">+</button></div></div>`}).join("");
      $("subtotal").textContent=money(total);
    }
    function toast(message){const t=$("toast");t.textContent=message;t.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove("show"),1900);}
    function openCart(){ $("drawer").classList.add("open");$("overlay").classList.add("open"); }
    function closeCart(){ $("drawer").classList.remove("open");$("overlay").classList.remove("open"); }
    document.addEventListener("click",e=>{
      const add=e.target.closest("[data-add]");if(add){const id=Number(add.dataset.add);cart.set(id,(cart.get(id)||0)+1);renderCart();toast("Added to your bag");}
      const qty=e.target.closest("[data-qty]");if(qty){const id=Number(qty.dataset.qty),next=(cart.get(id)||0)+Number(qty.dataset.change);if(next<=0)cart.delete(id);else cart.set(id,next);renderCart();}
      const filter=e.target.closest("[data-filter]");if(filter){activeFilter=filter.dataset.filter;document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("active",b===filter));renderProducts();}
    });
    $("search").addEventListener("input",renderProducts);
    $("openCart").addEventListener("click",openCart);$("closeCart").addEventListener("click",closeCart);$("overlay").addEventListener("click",closeCart);
    $("checkout").addEventListener("click",()=>{
      if(!cart.size){toast("Your bag is empty");return;}
      if(!/^\d{10,15}$/.test(WHATSAPP_NUMBER)){toast("Set your WhatsApp number in the site settings first");return;}
      const lines=[...cart.entries()].map(([id,qty])=>{const p=products.find(x=>x.id===id);return `${p.name} x ${qty} — ${money(p.price*qty)}`});
      const total=[...cart.entries()].reduce((sum,[id,qty])=>sum+products.find(p=>p.id===id).price*qty,0);
      const message=`Hello ANAX, I would like to enquire about:\n${lines.join("\n")}\nSubtotal: ${money(total)}\nPlease confirm availability and delivery details.`;
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,"_blank","noopener,noreferrer");
    });
    $("year").textContent=new Date().getFullYear();renderProducts();renderCart();
