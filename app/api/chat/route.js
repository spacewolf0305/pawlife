import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_PROMPT = `You are PawBuddy 🐾, a friendly and knowledgeable AI pet care assistant for the PawLife app. You help pet parents with:

- Pet health questions (symptoms, when to see a vet, first aid)
- Nutrition advice (safe/toxic foods, diet tips, feeding schedules)
- Training tips (basic commands, behavior issues, socialization)
- Breed information (characteristics, exercise needs, grooming)
- General pet care (grooming, dental care, exercise, mental stimulation)

RULES:
1. Always be warm, empathetic, and encouraging
2. Use relevant emojis to keep the tone friendly
3. If a pet seems seriously ill, ALWAYS recommend visiting a vet immediately
4. Keep responses concise (2-4 paragraphs max)
5. If the user shares their pet's info, personalize your answers
6. Never diagnose — suggest possibilities and recommend professional consultation
7. You can respond in the user's language if they write in Hindi or another language

If pet context is provided, reference the user's actual pet names and species in your responses.`;

// ─── Comprehensive Pet Knowledge Base ───
const KNOWLEDGE = [
    {
        keywords: ['toxic', 'chocolate', 'poison', 'poisonous', 'grape', 'raisin', 'onion', 'garlic', 'xylitol', 'avocado', 'can dogs eat', 'can cats eat', 'safe food', 'dangerous food', 'harmful food'],
        response: "🚨 **Toxic foods for pets:**\n\n🐕 **Dogs — AVOID:**\n• Chocolate (especially dark)\n• Grapes & raisins\n• Onions & garlic\n• Xylitol (sweetener in gum/candy)\n• Macadamia nuts\n• Alcohol & caffeine\n• Avocado\n• Cooked bones (can splinter)\n\n🐈 **Cats — AVOID:**\n• Lilies (extremely toxic!)\n• Onions & garlic\n• Chocolate & caffeine\n• Grapes & raisins\n• Raw eggs & raw fish\n• Dairy (many are lactose intolerant)\n\n🟢 **Safe treats:** Carrots, blueberries, watermelon (seedless), cooked chicken, pumpkin\n\n⚠️ If your pet ate something toxic, contact your vet or animal poison control immediately!"
    },
    {
        keywords: ['vaccine', 'vaccination', 'shot', 'immuniz', 'booster', 'rabies', 'distemper', 'parvo'],
        response: "💉 **Vaccination schedule:**\n\n🐕 **Dogs:**\n• 6-8 weeks: Distemper, Parvovirus\n• 10-12 weeks: DHPP booster\n• 14-16 weeks: DHPP, Rabies\n• Annually: Rabies booster, DHPP\n• Optional: Bordetella, Lyme, Canine influenza\n\n🐈 **Cats:**\n• 6-8 weeks: FVRCP\n• 10-12 weeks: FVRCP booster\n• 14-16 weeks: FVRCP, Rabies\n• Annually: Rabies, FVRCP booster\n• Optional: FeLV (especially outdoor cats)\n\n💡 **Tips:**\n• Keep a vaccination card/record\n• Set reminders for boosters\n• Puppies/kittens need more frequent visits\n\n📋 Always consult your vet for a personalized schedule!"
    },
    {
        keywords: ['scratch', 'itch', 'skin', 'flea', 'tick', 'rash', 'fur loss', 'hair loss', 'shedding', 'dandruff', 'hot spot', 'allerg'],
        response: "🐾 **Skin & scratching issues:**\n\n**Common causes:**\n1. 🦟 **Fleas/ticks** — check fur for tiny black dots or moving bugs\n2. 🤧 **Allergies** — food, pollen, dust mites, or cleaning products\n3. 🏜️ **Dry skin** — especially in winter or AC environments\n4. 🦠 **Skin infections** — bacterial or fungal (ringworm)\n5. 😰 **Stress/anxiety** — over-grooming or nervous scratching\n6. 🥩 **Poor nutrition** — lack of omega fatty acids\n\n**What you can do:**\n• Check for fleas with a fine-tooth comb\n• Try an oatmeal bath (soothing for irritated skin)\n• Add omega-3 supplements or fish oil to diet\n• Wash bedding in hypoallergenic detergent\n• Use vet-approved flea prevention monthly\n\n⚠️ See a vet if: scratching is severe, skin is red/bleeding, or fur is falling out in patches."
    },
    {
        keywords: ['train', 'behav', 'command', 'obedien', 'biting', 'bite', 'nip', 'chew', 'destructive', 'jump', 'pulling', 'leash', 'sit', 'stay', 'come', 'heel', 'crate', 'potty', 'housebreak', 'house train'],
        response: "🎓 **Training tips:**\n\n**Basic commands to start with:**\n1. **Sit** — hold treat above nose, move it back\n2. **Stay** — open palm gesture, step back slowly\n3. **Come** — crouch down, open arms, enthusiastic voice\n4. **Down** — lure treat from nose to ground\n5. **Leave it** — cover treat with hand, reward when they look away\n\n**Golden rules:**\n• ✅ Use **positive reinforcement** — treats, praise, play\n• ✅ Keep sessions **short** — 5-10 minutes, 2-3x daily\n• ✅ Be **consistent** — same words, same rewards, same rules\n• ✅ End on a **positive note** — always finish with a success\n• ❌ Never punish — it creates fear, not learning\n\n**For puppies biting/nipping:**\n• Say \"ouch!\" and stop playing (teaches bite inhibition)\n• Redirect to a chew toy\n• Socialization classes help (8-16 weeks is critical)\n\n**For cats:** Try clicker training with high-value treats like tuna!"
    },
    {
        keywords: ['feed', 'food', 'diet', 'nutrition', 'meal', 'hungry', 'weight', 'overweight', 'fat', 'thin', 'skinny', 'how much', 'portion', 'kibble', 'raw diet', 'homemade', 'treats'],
        response: "🍖 **Feeding & nutrition guide:**\n\n**How much to feed:**\n• 🐕 Dogs: Typically 2 meals/day. Check food bag for weight-based portions\n• 🐈 Cats: 2-3 small meals/day or measured free-feeding\n• 🐶 Puppies: 3-4 meals/day until 6 months, then 2/day\n• 🐱 Kittens: 3-4 meals/day until 1 year\n\n**Signs of good nutrition:**\n• Shiny, healthy coat\n• Good energy levels\n• Firm, regular stools\n• Healthy weight (can feel ribs but not see them)\n\n**Quick tips:**\n• 💧 Always provide fresh water\n• 🚫 Treats should be ≤10% of daily calories\n• 🔄 Change food gradually over 7-10 days to avoid stomach upset\n• 📏 Use a measuring cup — don't guess\n• 🥩 Look for food with real meat as the first ingredient\n\n⚖️ **Is your pet overweight?** Talk to your vet about a weight management plan!"
    },
    {
        keywords: ['groom', 'bath', 'bathe', 'shower', 'wash', 'nail', 'claw', 'trim', 'brush', 'mat', 'tangle', 'haircut', 'shave', 'clean ears', 'ear clean'],
        response: "✂️ **Grooming guide:**\n\n**Bathing:**\n• 🐕 Dogs: Every 4-8 weeks (more if they get dirty/smelly)\n• 🐈 Cats: Rarely needed — they self-groom! Only if very dirty\n• Use pet-specific shampoo (human shampoo is too harsh)\n• Lukewarm water, avoid getting water in ears\n\n**Brushing:**\n• Short coat: 1-2x per week\n• Long coat: Daily to prevent mats\n• Double coat (Huskies, Goldens): 2-3x per week, more during shedding season\n\n**Nail trimming:**\n• Every 2-4 weeks\n• Cut below the quick (pink part inside the nail)\n• Use treats and go slow — one paw at a time is OK!\n• If nails click on the floor, they're too long\n\n**Ear cleaning:**\n• Check weekly for redness, odor, or discharge\n• Use vet-approved ear cleaner\n• Floppy-eared breeds need more frequent cleaning\n\n**Dental care:**\n• Brush teeth 2-3x per week with pet toothpaste\n• Dental chews help too!"
    },
    {
        keywords: ['vomit', 'throw up', 'puke', 'sick', 'ill', 'unwell', 'lethargi', 'not eating', 'won\'t eat', 'refuse food', 'diarrhea', 'loose stool', 'blood in stool', 'blood in urine', 'limp', 'pain', 'crying', 'whimper', 'emergency', 'urgent'],
        response: "🏥 **When to see a vet IMMEDIATELY:**\n\n🚨 **Emergency signs — go NOW:**\n• Difficulty breathing or rapid breathing\n• Seizures or collapse\n• Bloated/swollen abdomen (especially large dogs)\n• Uncontrolled bleeding\n• Suspected poisoning\n• Unable to urinate (especially male cats)\n• Trauma (hit by car, fell from height)\n\n⚠️ **See a vet within 24 hours if:**\n• Vomiting/diarrhea lasting more than 24 hours\n• Not eating for more than 1 day (cats) or 2 days (dogs)\n• Blood in stool or urine\n• Lethargy or unusual behavior\n• Limping or signs of pain\n• Eye injury or squinting\n• Excessive thirst or urination\n\n💡 **For mild vomiting (1-2 times):**\n• Withhold food for 12 hours, offer small sips of water\n• Then offer bland food (boiled chicken + rice)\n• If it continues, see your vet\n\n📞 Keep your vet's emergency number saved in your phone!"
    },
    {
        keywords: ['puppy', 'kitten', 'new pet', 'just got', 'first time', 'new dog', 'new cat', 'adopt', 'bring home', 'prepare', 'checklist', 'starter'],
        response: "🏠 **New pet parent checklist:**\n\n**Before bringing them home:**\n• 🛏️ Bed or crate with soft bedding\n• 🍽️ Food and water bowls\n• 🥩 Age-appropriate food\n• 🧸 Toys (chew toys, interactive toys)\n• 🚽 Litter box (cats) or pee pads (puppies)\n• 🏷️ Collar with ID tag\n• 🔗 Leash and harness\n\n**First week tips:**\n1. **Give them space** — let them explore at their own pace\n2. **Set a routine** — consistent feeding, potty, sleep times\n3. **Puppy/kitten-proof** — hide cables, close toilet lids, secure trash\n4. **Start gentle handling** — touch paws, ears, mouth (helps with vet visits later)\n5. **Schedule a vet visit** within the first week\n\n**First month goals:**\n• Start basic training (name recognition, sit)\n• Begin socialization (new people, sounds, surfaces)\n• Establish a potty routine\n• Start crate training (dogs)\n\n❤️ Patience is key — it takes 2-3 weeks for pets to settle into a new home!"
    },
    {
        keywords: ['breed', 'what breed', 'best breed', 'which dog', 'which cat', 'labrador', 'golden retriever', 'german shepherd', 'poodle', 'bulldog', 'beagle', 'husky', 'persian', 'siamese', 'maine coon', 'ragdoll'],
        response: "🐕 **Popular breeds overview:**\n\n**Family-friendly dogs:**\n• 🦮 **Labrador Retriever** — gentle, active, great with kids\n• 🐕 **Golden Retriever** — loyal, friendly, easy to train\n• 🐩 **Poodle** — hypoallergenic, smart, various sizes\n• 🐕‍🦺 **Beagle** — playful, compact, great nose\n\n**For apartments:**\n• 🐶 French Bulldog — low energy, quiet\n• 🐕 Cavalier King Charles — gentle, adaptable\n• 🐈 **Any cat breed!** Cats are perfect for apartments\n\n**Active lifestyle:**\n• 🐺 Husky — energetic, needs lots of exercise\n• 🐕 Border Collie — smartest breed, needs mental stimulation\n• 🐕 German Shepherd — loyal, protective, trainable\n\n**Popular cat breeds:**\n• 🐱 Persian — calm, fluffy, indoor cats\n• 🐈 Siamese — vocal, social, playful\n• 🐈‍⬛ Maine Coon — large, gentle, dog-like personality\n• 🐱 Ragdoll — docile, affectionate, goes limp when held\n\n💡 **Tip:** Consider adopting from a shelter — mixed breeds are often healthier!"
    },
    {
        keywords: ['exercise', 'walk', 'run', 'play', 'active', 'energy', 'tired', 'lazy', 'bored', 'hyper', 'calm down', 'mental stimulation', 'enrichment'],
        response: "🏃 **Exercise & enrichment guide:**\n\n**Daily exercise needs:**\n• 🐶 Puppies: 5 min per month of age, 2x daily\n• 🐕 Small dogs: 30 min - 1 hour\n• 🐕 Medium/large dogs: 1-2 hours\n• 🐺 High-energy breeds (Husky, Border Collie): 2+ hours\n• 🐈 Cats: 15-30 min of active play daily\n\n**Fun activities:**\n🐕 **Dogs:** Fetch, tug-of-war, swimming, hiking, agility\n🐈 **Cats:** Feather wands, laser pointers, puzzle feeders, cat trees\n\n**Mental stimulation ideas:**\n• 🧩 Puzzle feeders and snuffle mats\n• 🔍 Hide treats around the house (nose work)\n• 🎾 Rotate toys to keep them interesting\n• 📦 Cardboard boxes (cats LOVE them)\n• 🧠 Teach new tricks — keeps their brain sharp!\n\n**Signs your pet needs more exercise:**\n• Destructive behavior (chewing, scratching furniture)\n• Hyperactivity or restlessness\n• Weight gain\n• Attention-seeking or barking\n\n💡 A tired pet is a well-behaved pet!"
    },
    {
        keywords: ['sleep', 'bed', 'crate', 'night', 'cry', 'whine', 'howl', 'restless', 'insomnia', 'how much sleep', 'sleeping too much', 'won\'t sleep'],
        response: "😴 **Sleep guide:**\n\n**Normal sleep amounts:**\n• 🐶 Puppies: 18-20 hours/day\n• 🐕 Adult dogs: 12-14 hours/day\n• 🐕 Senior dogs: 14-18 hours/day\n• 🐱 Kittens: 18-20 hours/day\n• 🐈 Adult cats: 12-16 hours/day (often more!)\n\n**For puppies crying at night:**\n1. Place crate near your bed (they want to be close)\n2. Add a warm water bottle wrapped in a towel\n3. Play calming music or white noise\n4. Take them for a potty break right before bed\n5. Don't give in to crying — wait for a pause, then comfort\n\n**Creating a good sleep environment:**\n• 🛏️ Comfortable, washable bed\n• 🌡️ Cool, quiet room\n• 📅 Consistent bedtime routine\n• 🚫 No heavy exercise right before bed\n• ✅ Final potty break at night\n\n⚠️ **See a vet if:** sudden changes in sleep patterns, excessive sleeping, or restlessness at night."
    },
    {
        keywords: ['anxiety', 'stress', 'scared', 'fearful', 'thunder', 'firework', 'separation', 'alone', 'destructive', 'bark', 'meow', 'aggressive', 'aggression', 'growl', 'hiss'],
        response: "😰 **Anxiety & behavior help:**\n\n**Common signs of anxiety:**\n• Excessive barking/meowing\n• Destructive behavior when alone\n• Panting, pacing, trembling\n• Hiding or clinging\n• Loss of appetite\n• Accidents inside (in potty-trained pets)\n\n**Separation anxiety tips:**\n1. Practice short departures and gradually increase\n2. Don't make a big deal of leaving or arriving\n3. Leave a worn shirt with your scent\n4. Puzzle toys/frozen Kongs to keep them busy\n5. Consider calming music (YouTube: \"music for dogs\")\n\n**For noise phobia (thunder/fireworks):**\n• Create a safe den — covered crate or closet\n• White noise or calming music\n• ThunderShirt or anxiety wrap\n• Desensitization training with recorded sounds\n• Talk to your vet about calming supplements\n\n**For aggression:**\n⚠️ Aggression should ALWAYS be addressed with a professional trainer or veterinary behaviorist. Don't try to handle it alone — safety first!\n\n💡 Calming products: Adaptil (dogs), Feliway (cats), calming chews"
    },
    {
        keywords: ['spay', 'neuter', 'steriliz', 'heat', 'in heat', 'mating', 'pregnant', 'pregnancy', 'breeding', 'litter', 'babies', 'pups', 'kittens born'],
        response: "🏥 **Spaying/Neutering guide:**\n\n**When to spay/neuter:**\n• 🐕 Dogs: 6-9 months (varies by breed/size)\n• 🐈 Cats: 4-5 months\n• Consult your vet for breed-specific recommendations\n\n**Benefits:**\n• ✅ Prevents unwanted litters\n• ✅ Reduces risk of certain cancers\n• ✅ Reduces roaming and marking behavior\n• ✅ Often calmer temperament\n• ✅ Female pets: prevents pyometra (deadly uterine infection)\n\n**Signs your pet is in heat:**\n🐕 Female dogs: Swollen vulva, bloody discharge, increased urination\n🐈 Female cats: Loud vocalization, rolling, restlessness, raised tail\n\n**Post-surgery care:**\n• Keep them calm for 10-14 days\n• Use an e-collar to prevent licking the incision\n• No jumping, running, or bathing\n• Check incision daily for swelling/redness\n• Follow your vet's pain medication instructions\n\n💡 Many shelters and organizations offer low-cost spay/neuter programs!"
    },
    {
        keywords: ['dental', 'teeth', 'gum', 'breath', 'bad breath', 'tartar', 'plaque', 'tooth', 'chew'],
        response: "🦷 **Pet dental care:**\n\n**Why it matters:**\n• 80% of dogs and cats show dental disease by age 3\n• Bad dental health can affect heart, kidneys, and liver\n\n**Signs of dental problems:**\n• 😤 Bad breath (not normal!)\n• 🩸 Red, swollen, or bleeding gums\n• 🍽️ Difficulty eating or dropping food\n• 🤤 Excessive drooling\n• 😢 Pawing at mouth\n\n**Home dental care:**\n1. **Brush teeth** 2-3x per week with pet toothpaste\n2. **Dental chews** — look for VOHC-approved products\n3. **Water additives** — enzyme-based dental rinses\n4. **Dental toys** — textured rubber toys help clean teeth\n5. **Raw carrots** — natural teeth cleaner for dogs!\n\n**Professional cleaning:**\n• Annual dental checkup at the vet\n• Professional cleaning under anesthesia if needed\n• Don't skip it — dental disease is painful!\n\n⚠️ Never use human toothpaste — fluoride is toxic to pets!"
    },
    {
        keywords: ['travel', 'car', 'road trip', 'fly', 'flight', 'airplane', 'vacation', 'board', 'kennel', 'pet sitter', 'move', 'moving'],
        response: "✈️ **Traveling with pets:**\n\n**Car travel tips:**\n• 🚗 Use a secured crate or pet seatbelt\n• 🚫 Never leave pets in a parked car (even for minutes!)\n• 💧 Stop every 2-3 hours for water and potty breaks\n• 🤢 For car sickness: short trips first, no food 2 hours before\n• 🪟 Crack windows but don't let them stick heads out\n\n**Flying tips:**\n• ✈️ Check airline pet policies well in advance\n• 💉 Get a health certificate from your vet (usually within 10 days)\n• 📦 Airline-approved carrier that fits under the seat\n• 💊 Talk to vet about anti-anxiety medication if needed\n• ⚠️ Avoid cargo for flat-faced breeds (breathing issues)\n\n**If you can't bring your pet:**\n• 🏠 Pet sitter at your home (least stressful)\n• 👨‍👩‍👦 Stay with trusted friend/family\n• 🏨 Reputable boarding facility (visit first!)\n\n📋 **Travel checklist:** Food, water bowl, leash, medications, vet records, waste bags, comfort item (favorite toy/blanket)"
    },
    {
        keywords: ['age', 'old', 'senior', 'elderly', 'lifespan', 'how long', 'life expectancy', 'aging', 'arthritis', 'joint'],
        response: "🧓 **Senior pet care:**\n\n**When is a pet \"senior\"?**\n• 🐕 Small dogs: 10-12 years\n• 🐕 Medium dogs: 8-10 years\n• 🐕 Large dogs: 6-8 years\n• 🐈 Cats: 10-12 years\n\n**Changes to expect:**\n• Slower, less active\n• Sleeping more\n• Gray muzzle/face\n• Possible hearing/vision loss\n• Stiff joints (especially mornings)\n\n**How to help them age comfortably:**\n• 🦴 Joint supplements (glucosamine, chondroitin)\n• 🛏️ Orthopedic bed with memory foam\n• 🪜 Ramps or steps for furniture/cars\n• 🍖 Senior-formula food (lower calories, joint support)\n• 🩺 Bi-annual vet checkups (twice a year instead of once)\n• 🧠 Keep their mind active with gentle puzzle games\n• ❤️ More patience and gentleness\n\n**Watch for warning signs:**\n• Sudden behavior changes\n• Unexplained weight loss/gain\n• Increased thirst or urination\n• Confusion or disorientation\n\n💡 Senior pets need extra love — they've given you their best years! 🧡"
    },
    {
        keywords: ['worm', 'deworming', 'parasite', 'intestin', 'tapeworm', 'roundworm', 'hookworm', 'heartworm', 'prevent'],
        response: "🪱 **Parasites & deworming:**\n\n**Common internal parasites:**\n• 🔴 Roundworms — pot-bellied appearance, visible in stool\n• 🟡 Hookworms — bloody stool, anemia\n• 🟠 Tapeworms — rice-like segments near tail/in stool\n• 🔵 Heartworms — coughing, fatigue (transmitted by mosquitoes)\n\n**Deworming schedule:**\n• 🐶 Puppies: Every 2 weeks until 12 weeks, monthly until 6 months\n• 🐱 Kittens: Similar schedule\n• 🐕 Adults: Every 3-6 months (or as vet recommends)\n• 🐈 Adult cats: Every 3-6 months\n\n**Prevention is key:**\n• Monthly heartworm prevention (year-round!)\n• Monthly flea/tick prevention (fleas carry tapeworms)\n• Pick up poop promptly\n• Regular fecal tests at vet visits\n• Wash hands after handling pets\n\n⚠️ **Heartworm is potentially fatal** and expensive to treat. Prevention costs much less than treatment!"
    },
    {
        keywords: ['eye', 'eye discharge', 'watery eye', 'red eye', 'cloudy eye', 'squint', 'tear stain'],
        response: "👁️ **Eye care for pets:**\n\n**Normal vs. concerning:**\n• ✅ Small amount of clear discharge = normal\n• ⚠️ Yellow/green discharge = possible infection\n• ⚠️ Excessive tearing = allergies or blocked tear duct\n• 🚨 Squinting/pawing at eye = pain — see vet ASAP\n• 🚨 Cloudy eye = possible cataracts or serious issue\n\n**Daily eye care:**\n• Gently wipe away discharge with a damp cloth\n• Use separate cloths for each eye\n• Keep face hair trimmed away from eyes\n• For tear stains: wipe daily, check for ear/dental issues\n\n**Common eye conditions:**\n• Cherry eye (red bulge in corner)\n• Conjunctivitis (pink eye)\n• Dry eye\n• Cataracts (common in senior pets and diabetic dogs)\n\n🏥 **See a vet immediately if:**\n• Sudden change in eye appearance\n• Swelling around the eye\n• Pet is squinting or keeping eye shut\n• Visible injury to the eye"
    },
    {
        keywords: ['adopt', 'rescue', 'shelter', 'stray', 'street dog', 'street cat', 'indie', 'desi dog', 'mixed breed', 'mutt'],
        response: "🏠 **Adopting & rescuing:**\n\n**Why adopt?**\n• ❤️ Save a life — millions of pets need homes\n• 💰 Often cheaper than buying from a breeder\n• 🐕 Mixed breeds are generally healthier (genetic diversity)\n• 🌟 Rescue pets are often incredibly grateful and loyal\n• ✅ Most shelter pets are already vaccinated and spayed/neutered\n\n**Indian indie/desi dogs are amazing:**\n• 🇮🇳 Naturally adapted to Indian climate\n• 💪 Fewer genetic health issues\n• 🧠 Very intelligent and street-smart\n• ❤️ Fiercely loyal once they trust you\n• 🏥 Lower vet bills overall\n\n**How to adopt:**\n1. Visit local shelters and rescues\n2. Check adoption portals online\n3. Ask about the pet's background and behavior\n4. Do a home visit/trial period if possible\n5. Be patient — bonding takes 2-4 weeks\n\n**Bringing a rescue home:**\n• Give them space and time\n• Establish a quiet safe zone\n• Be patient with fearful behavior\n• Routine helps them feel secure\n\n💡 *Don't shop, adopt!* 🐾"
    },
    {
        keywords: ['insur', 'insurance', 'vet cost', 'expensive', 'cost', 'afford', 'save money', 'budget', 'medical bill'],
        response: "💰 **Pet healthcare costs:**\n\n**Average annual vet costs in India:**\n• 🐕 Dogs: ₹5,000 - ₹15,000 (routine care)\n• 🐈 Cats: ₹3,000 - ₹10,000 (routine care)\n• ⚠️ Emergencies can cost ₹10,000 - ₹1,00,000+\n\n**Ways to save:**\n1. 🏥 Regular checkups — prevention is cheaper than treatment\n2. 💉 Keep vaccinations up to date\n3. 🪱 Monthly parasite prevention\n4. 🦷 Dental care at home (avoids expensive cleanings)\n5. 🐕 Pet insurance — covers emergencies and major illnesses\n6. 🏪 Buy medications online (often cheaper)\n7. 📱 Use PawLife to track health and catch issues early!\n\n**Pet insurance options in India:**\n• Bajaj Allianz Pet Insurance\n• HDFC Ergo Pet Insurance\n• New India Assurance\n\n💡 Start an emergency pet fund — even ₹500/month adds up and gives peace of mind!"
    },
    {
        keywords: ['hello', 'hi', 'hey', 'hola', 'namaste', 'good morning', 'good evening', 'sup', 'what can you do', 'help', 'who are you', 'what are you'],
        response: "🐾 **Hey there! I'm PawBuddy — your AI pet assistant!** 👋\n\nI'm here to help with everything pet-related. Here's what I know about:\n\n🏥 **Health** — symptoms, when to see a vet, first aid\n🍖 **Nutrition** — safe/toxic foods, diet tips, weight management\n💉 **Vaccinations** — schedules and reminders\n🎓 **Training** — commands, behavior, potty training\n✂️ **Grooming** — bathing, nail care, dental hygiene\n🐶 **New pets** — checklists, puppy/kitten care\n🐕 **Breeds** — finding the right pet for your lifestyle\n😰 **Behavior** — anxiety, aggression, destructive habits\n🧓 **Senior pets** — aging, joint care, comfort\n✈️ **Travel** — road trips, flying, boarding\n🏠 **Adoption** — rescue pets, stray care\n\n**Try asking me:**\n• \"My dog is vomiting, what should I do?\"\n• \"Best food for a 3-month-old kitten?\"\n• \"How to stop my puppy from biting?\"\n• \"Is my cat overweight?\"\n• \"Indian dog breeds for hot climate\"\n\nAsk me anything! 😊"
    },
];

function getFallbackResponse(message) {
    const lower = message.toLowerCase();

    // Score each topic by how many keywords match
    let bestMatch = null;
    let bestScore = 0;

    for (const topic of KNOWLEDGE) {
        let score = 0;
        for (const keyword of topic.keywords) {
            if (lower.includes(keyword)) {
                score += keyword.length; // Longer keyword matches = more specific = higher score
            }
        }
        if (score > bestScore) {
            bestScore = score;
            bestMatch = topic;
        }
    }

    // If we found a match with decent confidence, return it
    if (bestMatch && bestScore >= 2) {
        return bestMatch.response;
    }

    // If no good match, return the greeting/help response
    return KNOWLEDGE[KNOWLEDGE.length - 1].response;
}

export async function POST(req) {
    let userMessage = '';

    try {
        const body = await req.json();
        userMessage = body.message || '';
        const petContext = body.petContext || [];
        const history = body.history || [];

        if (!userMessage || typeof userMessage !== 'string') {
            return Response.json({ error: 'Message is required' }, { status: 400 });
        }

        const apiKey = process.env.GOOGLE_AI_API_KEY;
        console.log('[PawBuddy] API key present:', !!apiKey, '| Key starts with:', apiKey ? apiKey.substring(0, 8) + '...' : 'N/A');

        // Fallback mode — no API key configured
        if (!apiKey) {
            console.log('[PawBuddy] No API key, using fallback mode');
            return Response.json({
                reply: getFallbackResponse(userMessage),
                mode: 'fallback',
            });
        }

        // Gemini AI mode — using 1.5-flash for generous free tier (15 RPM, 1M tokens/day)
        const genAI = new GoogleGenerativeAI(apiKey);

        // Try multiple models in order of preference (2.5-flash confirmed working with free tier)
        const models = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
        let lastError = null;

        for (const modelName of models) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });

                // Build context-aware prompt
                let contextNote = '';
                if (petContext.length > 0) {
                    const petList = petContext.map(p => `${p.name} (${p.species}${p.breed ? ', ' + p.breed : ''}${p.age ? ', ' + p.age : ''})`).join(', ');
                    contextNote = `\n\nThe user has these pets: ${petList}. Reference them when relevant.`;
                }

                const fullPrompt = SYSTEM_PROMPT + contextNote + '\n\nUser message: ' + userMessage;

                console.log(`[PawBuddy] Trying model: ${modelName}...`);
                const result = await model.generateContent(fullPrompt);
                const reply = result.response.text();
                console.log(`[PawBuddy] ${modelName} responded successfully, length: ${reply.length}`);

                return Response.json({ reply, mode: 'ai' });
            } catch (modelError) {
                console.log(`[PawBuddy] ${modelName} failed: ${modelError.message}`);
                lastError = modelError;

                // If it's a quota error, try the next model
                if (modelError.message?.includes('429') || modelError.message?.includes('quota') || modelError.message?.includes('Resource has been exhausted')) {
                    continue;
                }
                // For other errors, break immediately
                break;
            }
        }

        // All models failed
        throw lastError || new Error('All models failed');
    } catch (error) {
        console.error('[PawBuddy] ERROR:', error.message || error);

        // If Gemini fails, fall back gracefully
        return Response.json({
            reply: getFallbackResponse(userMessage) + '\n\n---\n⚠️ *AI is temporarily unavailable. Showing quick info instead.*',
            mode: 'fallback',
            error: error.message || 'Unknown error',
        });
    }
}
