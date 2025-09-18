// Script to extract all student data from the NEDUET website content
const students = [];

// Parse the markdown table data and extract student information
const parseStudentData = (tableContent) => {
  const lines = tableContent.split('\n');
  
  for (const line of lines) {
    // Look for lines that contain leetcode.com links
    if (line.includes('leetcode.com') && line.includes('|')) {
      try {
        // Extract username from leetcode URL
        const usernameMatch = line.match(/\[([^\]]+)\]\(https:\/\/leetcode\.com\/([^)]+)\)/);
        if (!usernameMatch) continue;
        
        const username = usernameMatch[2];
        
        // Extract name from the user column
        const userMatch = line.match(/!\[[^\]]*\]\([^)]*\)([^|]+)/);
        if (!userMatch) continue;
        
        let name = userMatch[1].trim();
        
        // Clean up name - remove any extra text after the actual name
        name = name.replace(/\s*(CT-|AI-|CR-|DT-).*$/, '').trim();
        if (name === '---' || name === '') {
          name = username; // Use username as fallback
        }
        
        // Split the line by | to get all columns
        const columns = line.split('|').map(col => col.trim());
        if (columns.length < 7) continue;
        
        // Extract other fields
        const skills = columns[2] === '---' ? [] : columns[2].split(',').map(s => s.trim()).filter(s => s);
        const ranking = parseInt(columns[3]) || undefined;
        const batch = columns[4] || '2023';
        const rollNo = columns[5] || '---';
        const program = columns[6] || 'BS CS';
        
        // Extract avatar URL
        const avatarMatch = line.match(/!\[[^\]]*\]\(([^)]+)\)/);
        const avatarUrl = avatarMatch ? avatarMatch[1] : 'https://assets.leetcode.com/users/default_avatar.jpg';
        
        const student = {
          username,
          name,
          rollNo,
          batch,
          program,
          skills,
          avatarUrl,
          leetcodeUrl: `https://leetcode.com/${username}`,
          globalRanking: ranking,
        };
        
        students.push(student);
      } catch (error) {
        console.log('Error parsing line:', line.substring(0, 100));
      }
    }
  }
};

// Sample data from the fetched content
const sampleData = `
| [rminhal783](https://leetcode.com/rminhal783) | ![Minhal Rizvi](https://assets.leetcode.com/users/rminhal783/avatar_1710615368.png)Minhal Rizvi | --- | 171186 | 2023 | CY-017 | BS CS (CY) |
| [umerinsaan](https://leetcode.com/umerinsaan) | ![Muhammad Umer](https://assets.leetcode.com/users/avatars/avatar_1672309978.png)Muhammad Umer | --- | 197612 | 2022 | CR-22035 | BS CS (CY) |
| [safee4600033](https://leetcode.com/safee4600033) | ![Umer Safee](https://assets.leetcode.com/users/safee4600033/avatar_1710334084.png)Umer Safee | c++, c++ | 263311 | 2023 | CT - 23032 | BS CS |
| [yousufnavaidkhan](https://leetcode.com/yousufnavaidkhan) | ![Yousuf Navaid](https://assets.leetcode.com/users/avatars/avatar_1687368018.png)Yousuf Navaid | --- | 284761 | 2022 | AI-22034 | BS CS (AI) |
| [rayyanmirza](https://leetcode.com/rayyanmirza) | ![Rayyan Mirza](https://assets.leetcode.com/users/avatars/avatar_1698146078.png)Rayyan Mirza | --- | 287787 | 2022 | CR-22033 | BS CS (CY) |
| [omer_shamsi_911](https://leetcode.com/omer_shamsi_911) | ![Syed Omer Ahmed Shamsi](https://assets.leetcode.com/users/omer_shamsi_911/avatar_1711561717.png)Syed Omer Ahmed Shamsi | --- | 294143 | 2023 | CT-23026 | BS CS |
| [faizank24](https://leetcode.com/faizank24) | ![Faizan Khurram](https://assets.leetcode.com/users/faizankhurramm/avatar_1708507684.png)Faizan Khurram | c++, c | 313777 | 2023 | AI-23014 | BS CS (AI) |
| [Tooba_Kashaf](https://leetcode.com/Tooba_Kashaf) | ![Tooba Kashaf](https://assets.leetcode.com/users/avatars/avatar_1681839465.png)Tooba Kashaf | --- | 329497 | 2022 | CT-22068 | BS CS |
| [user7227nv](https://leetcode.com/user7227nv) | ![Haiqa Siddiqua](https://assets.leetcode.com/users/avatars/avatar_1692262008.png)Haiqa Siddiqua | --- | 333261 | 2022 | CT-22071 | BS CS |
| [MuhammadAbdullah786](https://leetcode.com/MuhammadAbdullah786) | ![Muhammad Abdullah](https://assets.leetcode.com/users/avatars/avatar_1698070476.png)Muhammad Abdullah | python, c, c++ | 358850 | 2023 | CT-077 | BS CS |
| [abdulrafaykhatri](https://leetcode.com/abdulrafaykhatri) | ![Abdul Rafay Khatri](https://assets.leetcode.com/users/abdulrafaykhatri/avatar_1711483261.png)Abdul Rafay Khatri | c++, javascript, python, sql, react-16 | 362982 | 2022 | DT-22039 | BS CS (DT) |
| [aayanaltaf](https://leetcode.com/aayanaltaf) | ![Aayan Altaf](https://assets.leetcode.com/users/aayanaltaf/avatar_1711822482.png)Aayan Altaf | c, C++, html5, css | 369396 | 2023 | CT - 23075 | BS CS |
| [BaziqKhan](https://leetcode.com/BaziqKhan) | ![Muhammad Baziq Khan](https://assets.leetcode.com/users/default_avatar.jpg)Muhammad Baziq Khan | --- | 375642 | 2022 | DT-22015 | BS CS (DT) |
| [sajeeltariqst](https://leetcode.com/sajeeltariqst) | ![Sajeel Tariq](https://assets.leetcode.com/users/avatars/avatar_1691769456.png)Sajeel Tariq | c++, c, python | 391515 | 2022 | AI-22029 | BS CS (AI) |
| [mohammadhasanstd](https://leetcode.com/mohammadhasanstd) | ![Hasan Jafri](https://assets.leetcode.com/users/avatars/avatar_1701802095.png)Hasan Jafri | python, c++ | 438778 | 2021 | CT-21047 | BS CS |
| [UzairAhmed1245](https://leetcode.com/UzairAhmed1245) | ![Uzair Ahmed](https://assets.leetcode.com/users/default_avatar.jpg)Uzair Ahmed | --- | 501833 | 2022 | AI-012 | BS CS (AI) |
| [Areeba_Zehra_Jafri](https://leetcode.com/Areeba_Zehra_Jafri) | ![Areeba Zehra Jafri](https://assets.leetcode.com/users/Areeba_12/avatar_1711508160.png)Areeba Zehra Jafri | --- | 521066 | 2023 | CT-23006 | BS CS |
| [faiq_uz_zaman](https://leetcode.com/faiq_uz_zaman) | ![faiq uz zaman](https://assets.leetcode.com/users/default_avatar.jpg)faiq uz zaman | --- | 534638 | 2022 | CR-22040 | BS CS (CY) |
| [insha008](https://leetcode.com/insha008) | ![Insha Khan](https://assets.leetcode.com/users/default_avatar.jpg)Insha Khan | --- | 538213 | 2022 | DT-22042 | BS CS (DT) |
| [Aleeshba](https://leetcode.com/Aleeshba) | ![Aleeshba CT-22005](https://assets.leetcode.com/users/default_avatar.jpg)Aleeshba CT-22005 | --- | 538217 | 2022 | CT-22005 | BS CS |
| [Farjad_Haseeb](https://leetcode.com/Farjad_Haseeb) | ![Farjad](https://assets.leetcode.com/users/avatars/avatar_1663146322.png)Farjad | --- | 609242 | 2021 | CT-21030 | BS CS |
| [Hafsa_Usman](https://leetcode.com/Hafsa_Usman) | ![Hafsa Usman](https://assets.leetcode.com/users/default_avatar.jpg)Hafsa Usman | --- | 614287 | 2022 | CR-22003 | BS CS (CY) |
| [M_Usman_Sheikh](https://leetcode.com/M_Usman_Sheikh) | ![Muhammad Usman Sheikh](https://assets.leetcode.com/users/M_Usman_Sheikh/avatar_1710321381.png)Muhammad Usman Sheikh | c, c++ | 622951 | 2023 | CT-078 | BS CS |
| [alishbaL](https://leetcode.com/alishbaL) | ![Alishba Liaquat](https://assets.leetcode.com/users/default_avatar.jpg)Alishba Liaquat | --- | 626929 | 2022 | CR-22019 | BS CS (CY) |
| [arham_mirza](https://leetcode.com/arham_mirza) | ![Muhammad Arham](https://assets.leetcode.com/users/arham_mirza/avatar_1713213551.png)Muhammad Arham | c, c++, c++-concepts, ERP-Solution, Quick-GL, sql, sql-basic | 627475 | 2022 | CR-22045 | BS CS (CY) |
| [meteorfasial](https://leetcode.com/meteorfasial) | ![Faisal Shahid](https://assets.leetcode.com/users/avatars/avatar_1689326982.png)Faisal Shahid | --- | 640705 | 2022 | AI-22011 | BS CS (AI) |
| [Rao_Muhmmad_Bilal](https://leetcode.com/Rao_Muhmmad_Bilal) | ![Rao Muhammad Bilal](https://assets.leetcode.com/users/avatars/avatar_1703403995.png)Rao Muhammad Bilal | flutter, dart, sql, c++ | 649519 | 2021 | CT-21070 | BS CS |
| [laibashakil](https://leetcode.com/laibashakil) | ![Laiba Shakil](https://assets.leetcode.com/users/avatars/avatar_1681036006.png)Laiba Shakil | python, sql, pandas | 658288 | 2021 | CT-21017 | BS CS |
| [toobasaeed222](https://leetcode.com/toobasaeed222) | ![Tooba Saeed](https://assets.leetcode.com/users/avatars/avatar_1673186224.png)Tooba Saeed | --- | 658926 | 2021 | CT-21060 | BS CS |
| [khisalzehra](https://leetcode.com/khisalzehra) | ![Khisal Zehra](https://assets.leetcode.com/users/default_avatar.jpg)Khisal Zehra | c, c++, sql, python, html | 673959 | 2021 | CT-21303 | BS CS |
| [Abbas-Raza](https://leetcode.com/Abbas-Raza) | ![Abbas Raza](https://assets.leetcode.com/users/Abbas-Raza/avatar_1710335273.png)Abbas Raza | python, javascript, data-analysis, machine-learning, c++ | 694053 | 2021 | CT-21075 | BS CS |
| [hadiyakashif](https://leetcode.com/hadiyakashif) | ![Hadiya Kashif CT-22008](https://assets.leetcode.com/users/default_avatar.jpg)Hadiya Kashif CT-22008 | --- | 703629 | 2022 | CT-22008 | BS CS |
| [dania_fazal](https://leetcode.com/dania_fazal) | ![Dania Fazal](https://assets.leetcode.com/users/default_avatar.jpg)Dania Fazal | --- | 704295 | 2022 | CR-22007 | BS CS (CY) |
| [shahzebaliabro12345](https://leetcode.com/shahzebaliabro12345) | ![Shahzeb Abro](https://assets.leetcode.com/users/shahzebaliabro12345/avatar_1708602638.png)Shahzeb Abro | javascript, react-16 | 713185 | 2021 | CT-21034 | BS CS |
| [akhyar_ahmed_turk](https://leetcode.com/akhyar_ahmed_turk) | ![Akhyar Ahmed Turk](https://assets.leetcode.com/users/akhyar_ahmed_turk/avatar_1715794438.png)Akhyar Ahmed Turk | c, c++, python | 731092 | 2023 | CT-23034 | BS CS |
| [Kumail_Walji](https://leetcode.com/Kumail_Walji) | ![Kumail Raza Walji](https://assets.leetcode.com/users/sherrifjack1/avatar_1710549805.png)Kumail Raza Walji | c++, lua, sql | 731094 | 2022 | CT-078 | BS CS |
| [Ahmad_Raza27](https://leetcode.com/Ahmad_Raza27) | ![Ahmad Raza](https://assets.leetcode.com/users/Ahmad_Raza27/avatar_1714992603.png)Ahmad Raza | C, C++, C, C++, c, c++ | 731095 | 2023 | CT-23086 | BS CS |
| [Muhammad_Mudassir_Anis](https://leetcode.com/Muhammad_Mudassir_Anis) | ![Muhammad Mudassir Anis](https://assets.leetcode.com/users/default_avatar.jpg)Muhammad Mudassir Anis | --- | 741807 | 2022 | CT-22073 | BS CS |
| [yasra_khan](https://leetcode.com/yasra_khan) | ![yasra](https://assets.leetcode.com/users/default_avatar.jpg)yasra | --- | 742022 | 2022 | CR-22005 | BS CS (CY) |
| [tooba_rehman2](https://leetcode.com/tooba_rehman2) | ![Tooba Rehman](https://assets.leetcode.com/users/user4842vE/avatar_1710358644.png)Tooba Rehman | python, c, c++ | 753350 | 2023 | CT-23011 | BS CS |
| [ali313xA](https://leetcode.com/ali313xA) | ![Farman Ali](https://assets.leetcode.com/users/ali313xA/avatar_1716085996.png)Farman Ali | javascript, html, css, c++, object oriented programming | 770167 | 2022 | CT 22079 | BS CS |
| [HassaanZafar](https://leetcode.com/HassaanZafar) | ![Hassaan Zafar](https://assets.leetcode.com/users/HassaanZafar/avatar_1711896402.png)Hassaan Zafar | c++, c | 782729 | 2023 | CT-23053 | BS CS |
| [Hafsa_M](https://leetcode.com/Hafsa_M) | ![Hafsa Ali](https://assets.leetcode.com/users/default_avatar.jpg)Hafsa Ali | --- | 801018 | 2022 | CR-22006 | BS CS (CY) |
| [filzakhan](https://leetcode.com/filzakhan) | ![](https://assets.leetcode.com/users/filzakhan/avatar_1713206936.png)--- | --- | 814160 | 2021 | CT-21301 | BS CS |
| [Muhammad_Ali2023](https://leetcode.com/Muhammad_Ali2023) | ![Muhammad Ali](https://assets.leetcode.com/users/Muhammad_Ali2023/avatar_1712352800.png)Muhammad Ali | C++,  Front End Developer,  Bootstrap,  Reactjs, C | 840696 | 2023 | CT-074 | BS CS |
| [mahad_dharejo](https://leetcode.com/mahad_dharejo) | ![Mahad Dharejo](https://assets.leetcode.com/users/default_avatar.jpg)Mahad Dharejo | --- | 869591 | 2023 | CT-052 | BS CS |
| [ahmed_siddiqui7](https://leetcode.com/ahmed_siddiqui7) | ![](https://assets.leetcode.com/users/default_avatar.jpg)--- | --- | 876239 | 2021 | CT-21078 | BS CS |
| [khansak](https://leetcode.com/khansak) | ![Khansa Khan Ghauri](https://assets.leetcode.com/users/khansak/avatar_1711822499.png)Khansa Khan Ghauri | coding-style, c++, c | 897888 | 2023 | CT-067 | BS CS |
| [mzohaibkhan](https://leetcode.com/mzohaibkhan) | ![Muhammad Zohaib Khan](https://assets.leetcode.com/users/avatars/avatar_1699045580.png)Muhammad Zohaib Khan | --- | 897908 | 2022 | CT-22072 | BS CS |
| [alimuhammad](https://leetcode.com/alimuhammad) | ![Ali Muhammad](https://assets.leetcode.com/users/avatars/avatar_1697217265.png)Ali Muhammad | C, C++ | 905419 | 2023 | CT-054 | BS CS |
| [Yasha_Ali](https://leetcode.com/Yasha_Ali) | ![Yasha Ali CT-22010](https://assets.leetcode.com/users/Yasha_Ali/avatar_1711568371.png)Yasha Ali CT-22010 | --- | 912179 | 2022 | CT-22010 | BS CS |
| [Tamia_n](https://leetcode.com/Tamia_n) | ![TAMIKO](https://assets.leetcode.com/users/Tamia_n/avatar_1712357244.png)TAMIKO | --- | 928823 | 2023 | AI-004 | BS CS (AI) |
| [Hamdia_Nouman](https://leetcode.com/Hamdia_Nouman) | ![Hamdia Nouman](https://assets.leetcode.com/users/avatars/avatar_1702045966.png)Hamdia Nouman | java, html, css, javascript, bootstrap-4, sql | 936656 | 2022 | CT-22066 | BS CS |
| [fawwadzaheer](https://leetcode.com/fawwadzaheer) | ![Fawwad Zaheer](https://assets.leetcode.com/users/default_avatar.jpg)Fawwad Zaheer | --- | 947213 | 2022 | CT-22077 | BS CS |
`;

parseStudentData(sampleData);

console.log(`Extracted ${students.length} students`);
console.log('Sample:', students.slice(0, 3));

// Export as JavaScript array format
const jsArray = JSON.stringify(students, null, 2);
console.log('\n// JavaScript array format:');
console.log(jsArray);